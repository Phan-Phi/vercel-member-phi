import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useForm, Controller } from "react-hook-form";
import React, { useEffect, useMemo, useState, Fragment, useCallback } from "react";

import useSWR from "swr";
import { formatISO } from "date-fns";
import { get, set, pick, isEmpty, cloneDeep } from "lodash";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";

import {
  Loading,
  Container,
  DatePicker,
  InputNumber,
  BoxWithShadow,
  LoadingButton,
  FormControlV2,
  FormControlBase,
  CheckboxSingleChoice,
  FormControlForPhoneNumberV2,
} from "components";
import MembershipTable from "./MembershipTable";

import axios from "axios.config";
import { PATHNAME } from "routes";
import { CUSTOMERS, RANKS } from "apis";
import { BUTTON, SAFE_OFFSET } from "constant";
import { customerSchema, CustomerProps } from "yups";

import {
  RANKS_ITEM,
  responseSchema,
  CUSTOMERS_ITEM,
  CUSTOMERS_WALLETS_ITEM,
  CUSTOMERS_ADDRESSES_ITEM,
  MERCHANTS_STORES_MEMBERSHIPS_ITEM,
} from "interfaces";

import {
  useChoice,
  useFetch,
  usePermission,
  useNotification,
  useGetHeightForTable,
} from "hooks";

import {
  transformUrl,
  setFilterValue,
  convertValueToTupleForAddress,
  getDisplayValueFromChoiceItem,
} from "libs";

const CUSTOMER_KEY = [
  "self",
  "ward",
  "email",
  "wallet",
  "gender",
  "orders",
  "address",
  "district",
  "province",
  "birthday",
  "last_name",
  "is_active",
  "first_name",
  "memberships",
  "phone_number",
] as const;

const DetailCustomer = () => {
  const router = useRouter();
  const isMounted = useMountedState();

  const [defaultValues, setDefaultValues] = useState<CustomerProps>();

  const { data: customerData, mutate: mutateCustomer } = useSWR<CUSTOMERS_ITEM>(
    transformUrl(`${CUSTOMERS}${router.query.id}`, {
      use_cache: false,
    })
  );

  const { data: customerAddressData, mutate: mutateCustomerAddress } = useSWR<
    responseSchema<CUSTOMERS_ADDRESSES_ITEM>
  >(() => {
    if (customerData == undefined) return;

    return customerData.addresses;
  });

  const setDefaultValuesHandler = useCallback((customerData, customerAddressData) => {
    if (customerData == undefined || customerAddressData == undefined) return;

    const customerAddressItem = customerAddressData.results[0];

    if (customerAddressItem == undefined) return;

    convertValueToTupleForAddress(customerAddressItem).then((resData) => {
      if (resData) {
        const { province, district, ward } = resData;

        const [, provinceDisplayValue] = province;
        const [, districtDisplayValue] = district;
        const [, wardDisplayValue] = ward;

        let birthday = customerData.birthday;

        if (typeof birthday === "string") {
          birthday = new Date(birthday);
        }

        const temp = {
          ...customerData,
          address: customerAddressItem.line,
          province: provinceDisplayValue,
          district: districtDisplayValue,
          ward: wardDisplayValue,
          birthday,
        };

        if (isMounted()) {
          setDefaultValues(pick(temp, CUSTOMER_KEY));
        }
      }
    });
  }, []);

  useEffect(() => {
    setDefaultValuesHandler(customerData, customerAddressData);
  }, [customerData, customerAddressData, setDefaultValuesHandler]);

  const onSuccessHandler = useCallback(async () => {
    setDefaultValues(undefined);

    const [newCustomerData, customerAddressData] = await Promise.all([
      mutateCustomer(),
      mutateCustomerAddress(),
    ]);

    setDefaultValuesHandler(newCustomerData, customerAddressData);
  }, []);

  if (defaultValues == undefined) return <Loading />;

  return (
    <RootComponent
      {...{
        defaultValues,
        onSuccessHandler,
      }}
    />
  );
};

interface RootComponentProps {
  defaultValues: CustomerProps;
  onSuccessHandler: () => Promise<void>;
}

const defaultFilterValue = {
  limit: 25,
  offset: 0,
  with_count: true,
};

const RootComponent = (props: RootComponentProps) => {
  const router = useRouter();
  const { genders } = useChoice();
  const { hasPermission } = usePermission("write_customer");

  const [ref, { height }] = useGetHeightForTable();
  const [filter, setFilter] = useState(defaultFilterValue);

  const { defaultValues, onSuccessHandler } = props;

  const { data: customerWalletData } = useSWR<responseSchema<CUSTOMERS_WALLETS_ITEM>>(
    defaultValues.wallet
  );
  const { data: rankData } = useSWR<responseSchema<RANKS_ITEM>>(() => {
    if (!hasPermission) return;
    return RANKS;
  });

  const { data, isLoading, itemCount, changeKey } =
    useFetch<MERCHANTS_STORES_MEMBERSHIPS_ITEM>("");

  // transformUrl(defaultValues?.memberships, filter)

  useEffect(() => {
    if (!hasPermission) return;
    if (defaultValues == undefined) return;

    changeKey(transformUrl(defaultValues.memberships, filter));
  }, [defaultValues, filter, hasPermission]);

  const isMounted = useMountedState();

  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const {
    handleSubmit,
    control,
    formState: { dirtyFields },
  } = useForm({
    resolver: customerSchema(),
    defaultValues,
  });

  const onSubmit = useCallback(
    async ({
      data,
      dirtyData,
    }: {
      data: CustomerProps;
      dirtyData: typeof dirtyFields;
    }) => {
      try {
        setLoading(true);

        if (!isEmpty(dirtyData)) {
          const birthday = get(data, "birthday");

          if (birthday) {
            set(data, "birthday", formatISO(birthday));
          }

          const self = get(data, "self");
          const body = pick(data, Object.keys(dirtyData));

          if (self) {
            await axios.patch<CUSTOMERS_ITEM>(self, body);

            enqueueSnackbarWithSuccess("Cập nhật khách hàng thành công");

            onSuccessHandler();
          }

          isMounted() && setIsUpdateMode(false);
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        isMounted() && setLoading(false);
      }
    },
    []
  );

  const onGotoHandler = useCallback((props: any) => {
    return (e: React.SyntheticEvent) => {
      e.preventDefault();

      const { row } = props;

      const storeUrl: string | undefined = get(row, "original.store");

      if (storeUrl) {
        const id = storeUrl
          .split("/")
          .filter((el) => el !== "")
          .pop();
        if (id) {
          window.open(`/${PATHNAME.DOI_TAC}/${PATHNAME.THIET_LAP_QUAN}/${id}`, "_blank");
        }
      }
    };
  }, []);

  const onGoBackHandler = useCallback((isUpdateMode: boolean) => {
    return () => {
      if (isUpdateMode) {
        setIsUpdateMode(false);
      } else {
        router.push(`/${PATHNAME.KHACH_HANG}/${PATHNAME.TAI_KHOAN}`);
      }
    };
  }, []);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        const params = cloneDeep(cloneFilter);

        changeKey(transformUrl(defaultValues.memberships, params));
      };
    },
    [filter, defaultValues]
  );

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  const renderCustomerPoint = useMemo(() => {
    if (customerWalletData == undefined) {
      return (
        <Grid item xs={12}>
          <Loading />
        </Grid>
      );
    }

    const customerWallet = customerWalletData.results[0];

    if (customerWallet) {
      const { point_in, point_out } = customerWallet;

      const currentPoint = point_in - point_out;

      return (
        <Fragment>
          <Grid item xs={12}>
            <Typography variant="h2" color="primary2.main">
              Thông Tin Tích Lũy
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <InputNumber
              readOnly={true}
              NumberFormatProps={{
                value: point_in,
              }}
              FormLabelProps={{
                children: "Tổng Điểm",
              }}
              InputProps={{
                inputProps: {
                  placeholder: "Tổng Điểm",
                },
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <InputNumber
              readOnly={true}
              NumberFormatProps={{
                value: point_out,
              }}
              FormLabelProps={{
                children: "Đã Dùng",
              }}
              InputProps={{
                inputProps: {
                  placeholder: "Đã Dùng",
                },
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <InputNumber
              readOnly={true}
              NumberFormatProps={{
                value: currentPoint,
              }}
              FormLabelProps={{
                children: "Điểm Hiện Tại",
              }}
              InputProps={{
                inputProps: {
                  placeholder: "Điểm Hiện Tại",
                },
              }}
            />
          </Grid>
        </Fragment>
      );
    } else {
      return null;
    }
  }, [customerWalletData]);

  const renderMembership = useMemo(() => {
    if (!hasPermission) return null;

    if (rankData == undefined) {
      return (
        <Grid item xs={12}>
          <Loading />
        </Grid>
      );
    }

    return (
      <Fragment>
        <Grid item xs={12}>
          <Typography variant="h2" color="primary2.main">
            Thông Tin Thành Viên
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Box ref={ref}>
            <MembershipTable
              data={data ?? []}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
              count={itemCount}
              isLoading={isLoading}
              pagination={pagination}
              onGotoHandler={onGotoHandler}
              rankData={rankData.results}
              orderUrl={defaultValues.orders}
            />
          </Box>
        </Grid>
      </Fragment>
    );
  }, [
    data,
    rankData,
    defaultValues.orders,
    itemCount,
    isLoading,
    pagination,
    hasPermission,
  ]);

  return (
    <Container>
      <Stack spacing={3}>
        <BoxWithShadow>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                Thông Tin Khách Hàng
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Controller
                name="last_name"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      label="Họ"
                      placeholder="Họ"
                      controlState={props}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                control={control}
                name="first_name"
                render={(props) => {
                  return (
                    <FormControlV2
                      label="Tên"
                      placeholder="Tên"
                      controlState={props}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                control={control}
                name="is_active"
                render={(props) => {
                  return (
                    <CheckboxSingleChoice
                      controlState={props}
                      label="Trạng thái"
                      checkboxLabel={props.field.value ? "Kích hoạt" : "Chưa kích hoạt"}
                      CheckboxProps={{
                        sx: {
                          pointerEvents: isUpdateMode ? "all" : "none",
                        },
                        disabled: isUpdateMode ? false : true,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={3}>
              <DatePicker
                control={control}
                name="birthday"
                DatePickerProps={{
                  disabled: isUpdateMode ? false : true,
                }}
                InputProps={{
                  readOnly: isUpdateMode ? false : true,
                }}
                label="Ngày Sinh"
              />
            </Grid>

            <Grid item xs={3}>
              {defaultValues.gender && (
                <FormControlBase
                  InputProps={{
                    readOnly: true,
                    placeholder: "Giới Tính",
                    value: getDisplayValueFromChoiceItem(genders, defaultValues.gender),
                  }}
                  FormLabelProps={{
                    children: "Giới Tính",
                  }}
                />
              )}
            </Grid>

            <Grid item xs={3}>
              <Controller
                control={control}
                name="phone_number"
                render={(props) => {
                  return (
                    <FormControlForPhoneNumberV2
                      controlState={props}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={3}>
              <Controller
                name="email"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      label="Email"
                      placeholder="Email"
                      controlState={props}
                      InputProps={{
                        readOnly: isUpdateMode ? false : true,
                        type: "email",
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={3}>
              <Controller
                control={control}
                name="address"
                render={(props) => {
                  return (
                    <FormControlV2
                      label="Địa Chỉ"
                      placeholder="Địa Chỉ"
                      controlState={props}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={3}>
              <Controller
                name="province"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      label="Tỉnh/Thành"
                      placeholder="Tỉnh/Thành"
                      controlState={props}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={3}>
              <Controller
                name="district"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      label="Quận/Huyện"
                      placeholder="Quận/Huyện"
                      controlState={props}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={3}>
              <Controller
                control={control}
                name="ward"
                render={(props) => {
                  return (
                    <FormControlV2
                      label="Phường/Xã"
                      placeholder="Phường/Xã"
                      controlState={props}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            {renderCustomerPoint}

            {renderMembership}
          </Grid>
        </BoxWithShadow>

        <Stack flexDirection={"row"} columnGap={2} justifyContent="center">
          <Button
            variant="outlined"
            disabled={loading}
            onClick={onGoBackHandler(isUpdateMode)}
          >
            {BUTTON.BACK}
          </Button>
          {hasPermission && (
            <LoadingButton
              onClick={() => {
                if (isUpdateMode) {
                  handleSubmit((data) => {
                    onSubmit({
                      data,
                      dirtyData: dirtyFields,
                    });
                  })();
                } else {
                  setIsUpdateMode(true);
                }
              }}
              loading={loading}
            >
              {isUpdateMode ? BUTTON.UPDATE : BUTTON.EDIT}
            </LoadingButton>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

export default DetailCustomer;
