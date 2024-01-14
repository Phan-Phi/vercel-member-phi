import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useForm, Controller } from "react-hook-form";
import React, { useCallback, useMemo, useState, useEffect } from "react";

import useSWR from "swr";
import slugify from "slugify";
import { formatISO } from "date-fns";
import { get, set, pick, isEmpty } from "lodash";
import { Grid, Typography, Stack, Button, Autocomplete, Input } from "@mui/material";

import {
  Ward,
  Loading,
  District,
  Province,
  Container,
  LoadingButton,
  BoxWithShadow,
  FormControlV2,
  FormControlBase,
  CheckboxSingleChoice,
  InputForAutocomplete,
  FormControlForNumberV2,
  FormControlForPhoneNumberV2,
  FormCreditCard,
} from "components";

import {
  responseSchema,
  MERCHANTS_ITEM,
  MERCHANTS_STORES_ITEM,
  MERCHANTS_ADDRESSES_ITEM,
  MERCHANTS_BANK_ACCOUNTS_ITEM,
  MERCHANTS_STORES_CATEGORIES_ITEM,
} from "interfaces";

import {
  PartnerProps,
  partnerSchema,
  PartnerAddressProps,
  partnerAddressSchema,
} from "yups";

import {
  transformUrl,
  convertValueToTupleForAddress,
  transformArrayAddressToString,
} from "libs";

import axios from "axios.config";
import { PATHNAME } from "routes";
import { BUTTON } from "constant";
import { MERCHANTS, MERCHANTS_STORES_CATEGORIES } from "apis";
import { useChoice, useNotification, usePermission } from "hooks";
import { NumberFormatValues } from "react-number-format";

const MERCHANT_KEY = [
  "activated_by_person_name",
  "phone_number",
  "first_name",
  "last_name",
  "is_active",
  "birthday",
  "gender",
  "email",
  "note",
  "self",
] as const;

const BANK_ACCOUNT_KEY = [
  "account_number",
  "bank_branch",
  "owner_name",
  "bank_name",
] as const;

const STORE_KEY = [
  "store_category",
  "store_is_active",
  "store_is_published",
  "store_name",
];

const STORE_KEY_MAPPING: {
  [key: string]: string;
} = {
  store_category: "category",
  store_is_active: "is_active",
  store_is_published: "is_published",
  store_name: "name",
};

const DetailPartner = () => {
  const router = useRouter();

  const [defaultValues, setDefaultValues] = useState<PartnerProps>();
  const [defaultAddressValues, setDefaultAddressValues] = useState<PartnerAddressProps>();

  const { data: merchantData, mutate: merchantMutate } = useSWR<MERCHANTS_ITEM>(() => {
    const id = router.query.id;

    if (id == undefined) return;

    return transformUrl(`${MERCHANTS}${id}/`, {
      use_cache: false,
    });
  });

  const { data: merchantBankAccountData, mutate: marchantBackAccountMutate } = useSWR<
    responseSchema<MERCHANTS_BANK_ACCOUNTS_ITEM>
  >(() => {
    if (merchantData == undefined) return;

    return transformUrl(merchantData.bank_accounts, {
      use_cache: false,
    });
  });

  const { data: merchantStoreData, mutate: merchantStoreMutate } = useSWR<
    responseSchema<MERCHANTS_STORES_ITEM>
  >(() => {
    if (merchantData == undefined) return;

    return transformUrl(merchantData.stores, {
      use_cache: false,
    });
  });

  const { data: merchantCategoryData, mutate: merchantCategoryMutate } =
    useSWR<MERCHANTS_STORES_CATEGORIES_ITEM>(() => {
      if (merchantStoreData == undefined) return;

      const categoryUrl = get(merchantStoreData.results, "[0].category");

      return transformUrl(categoryUrl, {
        use_cache: false,
      });
    });

  const { data: merchantAddressData, mutate: merchantAddressMutate } = useSWR<
    responseSchema<MERCHANTS_ADDRESSES_ITEM>
  >(() => {
    if (merchantData == undefined) return;

    return transformUrl(merchantData.addresses, {
      use_cache: false,
    });
  });

  const setDefaultValuesHandler = useCallback(
    ({
      merchantData,
      merchantBankAccountData,
      merchantCategoryData,
      merchantStoreData,
    }: {
      merchantData: MERCHANTS_ITEM | undefined;
      merchantBankAccountData: responseSchema<MERCHANTS_BANK_ACCOUNTS_ITEM> | undefined;
      merchantCategoryData: MERCHANTS_STORES_CATEGORIES_ITEM | undefined;
      merchantStoreData: responseSchema<MERCHANTS_STORES_ITEM> | undefined;
    }) => {
      if (
        merchantData == undefined ||
        merchantBankAccountData == undefined ||
        merchantCategoryData == undefined ||
        merchantStoreData == undefined
      ) {
        return;
      }

      // * PICK MERCHANT INFO

      const data = {} as PartnerProps;

      MERCHANT_KEY.forEach((key) => {
        if (key === "birthday") {
          const birthday = merchantData.birthday;

          if (typeof birthday === "string") {
            set(data, key, new Date(birthday));

            return;
          }

          set(data, key, birthday);
          return;
        }

        set(data, key, merchantData[key]);
      });

      // * PICK BANK ACCOUNT INFO

      const bankAccountData = merchantBankAccountData.results?.[0];

      set(data, "bankSelf", bankAccountData.self);

      BANK_ACCOUNT_KEY.forEach((key) => {
        set(data, key, bankAccountData[key]);
      });

      // * PICK STORE CATEGORY INFO

      set(data, "store_category", merchantCategoryData); // ? store_category

      // * PICK STORE INFO

      const storeData = merchantStoreData.results?.[0];

      set(data, "store_is_active", storeData.is_active); // ? store_is_active
      set(data, "store_is_published", storeData.is_published); // ? store_is_published
      set(data, "store_name", storeData.name); // ? store_name
      set(data, "storeSelf", storeData.self);
      set(data, "storeSlug", storeData.slug);

      setDefaultValues(data);
    },
    []
  );

  const setDefaultAddressValuesHandler = useCallback(
    (merchantAddressData: responseSchema<MERCHANTS_ADDRESSES_ITEM> | undefined) => {
      if (merchantAddressData == undefined) return;

      const data: MERCHANTS_ADDRESSES_ITEM = get(merchantAddressData, "results.[0]");

      convertValueToTupleForAddress(data).then((transformedData) => {
        if (transformedData) {
          setDefaultAddressValues({ ...data, ...transformedData });
        }
      });
    },
    []
  );

  useEffect(() => {
    setDefaultValuesHandler({
      merchantData,
      merchantBankAccountData,
      merchantCategoryData,
      merchantStoreData,
    });
  }, [merchantData, merchantBankAccountData, merchantCategoryData, merchantStoreData]);

  useEffect(() => {
    setDefaultAddressValuesHandler(merchantAddressData);
  }, [merchantAddressData]);

  const onSuccessHandler = useCallback(async () => {
    setDefaultValues(undefined);
    setDefaultAddressValues(undefined);

    const [
      newMerchantDataNew,
      newMerchantBankAccountData,
      newMerchantStoreData,
      newMerchantAddressData,
      newMerchantCategoryData,
    ] = await Promise.all([
      merchantMutate(),
      marchantBackAccountMutate(),
      merchantStoreMutate(),
      merchantAddressMutate(),
      merchantCategoryMutate(),
    ]);

    setDefaultValuesHandler({
      merchantData: newMerchantDataNew,
      merchantBankAccountData: newMerchantBankAccountData,
      merchantStoreData: newMerchantStoreData,
      merchantCategoryData: newMerchantCategoryData,
    });

    setDefaultAddressValuesHandler(newMerchantAddressData);
  }, []);

  if (defaultValues == undefined || defaultAddressValues == undefined) {
    return <Loading />;
  }

  return <RootComponent {...{ defaultValues, defaultAddressValues, onSuccessHandler }} />;
};

interface RootComponentProps {
  defaultValues: PartnerProps;
  defaultAddressValues: PartnerAddressProps;
  onSuccessHandler: () => Promise<void>;
}

const RootComponent = (props: RootComponentProps) => {
  const choice = useChoice();
  const router = useRouter();
  const { hasPermission } = usePermission("write_merchant");

  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { defaultValues, defaultAddressValues, onSuccessHandler } = props;

  const { data } = useSWR<responseSchema<MERCHANTS_STORES_CATEGORIES_ITEM>>(
    transformUrl(MERCHANTS_STORES_CATEGORIES, {
      limit: 1000,
    })
  );

  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { dirtyFields },
  } = useForm({
    resolver: partnerSchema(choice),
    defaultValues,
  });

  const {
    watch: partnerAddressWatch,
    control: partnerAddressControl,
    setValue: partnerAddressSetValue,
    handleSubmit: partnerAddressHandleSubmit,
    formState: { dirtyFields: partnerAddressDirtyFields },
  } = useForm({
    resolver: partnerAddressSchema(),
    defaultValues: defaultAddressValues,
  });

  const onSubmit = useCallback(
    async ({
      data,
      addressData,
      dirtyData,
      dirtyAddressData,
    }: {
      data: PartnerProps;
      addressData: PartnerAddressProps;
      dirtyData: typeof dirtyFields;
      dirtyAddressData: typeof partnerAddressDirtyFields;
    }) => {
      try {
        const promiseList: [
          undefined | Promise<MERCHANTS_ITEM>,
          undefined | Promise<MERCHANTS_BANK_ACCOUNTS_ITEM>,
          undefined | Promise<MERCHANTS_STORES_ITEM>,
          undefined | Promise<MERCHANTS_ADDRESSES_ITEM>
        ] = [undefined, undefined, undefined, undefined];
        setLoading(true);
        if (!isEmpty(dirtyData)) {
          // * PRE-PROCESS DATA
          const birthday = get(data, "birthday");
          const storeCategory = get(data, "store_category");
          if (birthday) {
            set(data, "birthday", formatISO(birthday));
          }
          if (storeCategory) {
            set(data, "store_category", get(storeCategory, "self"));
          }
          // * SEPERATE DATA FOR EACH UPDATE
          const merchantData = pick(data, MERCHANT_KEY);
          const dirtyMerchantData = pick(dirtyData, MERCHANT_KEY);
          const bankAccountData = pick(data, BANK_ACCOUNT_KEY);
          const dirtyBankAccountData = pick(dirtyData, BANK_ACCOUNT_KEY);
          const storeData = pick(data, STORE_KEY) as {
            [key: string]: string;
          };
          const dirtyStoreData = pick(dirtyData, STORE_KEY);
          // * UPDATE MERCHANT INFO
          if (!isEmpty(dirtyMerchantData)) {
            const self = get(data, "self");
            const body = pick(merchantData, Object.keys(dirtyMerchantData));
            if (self) {
              promiseList[0] = axios.patch<MERCHANTS_ITEM>(self, body).then((resData) => {
                const { data } = resData;
                return data;
              });
            }
          }
          // * UPDATE BANK ACCOUNT MARCHANT INFO
          if (!isEmpty(dirtyBankAccountData)) {
            const self = get(data, "bankSelf");
            const body = pick(bankAccountData, Object.keys(dirtyBankAccountData));
            if (self) {
              promiseList[1] = axios
                .patch<MERCHANTS_BANK_ACCOUNTS_ITEM>(self, body)
                .then((resData) => {
                  const { data } = resData;
                  return data;
                });
            }
          }
          // * UPDATE STORE INFO
          if (!isEmpty(dirtyStoreData)) {
            const self = get(data, "storeSelf");
            const body: any = {};
            for (const key of Object.keys(dirtyStoreData)) {
              body[STORE_KEY_MAPPING[key]] = storeData[key];
            }
            if (self) {
              promiseList[2] = axios
                .patch<MERCHANTS_STORES_ITEM>(self, body)
                .then((resData) => {
                  const { data } = resData;
                  return data;
                });
            }
          }
        }
        // * UPDATE MERCHANT ADDRESS
        if (!isEmpty(dirtyAddressData)) {
          const self = get(addressData, "self");
          // * PRE-PROCESS DATA
          addressData = transformArrayAddressToString(addressData);
          const body = pick(addressData, Object.keys(dirtyAddressData));
          if (self) {
            promiseList[3] = axios
              .patch<MERCHANTS_ADDRESSES_ITEM>(self, body)
              .then((resData) => {
                const { data } = resData;
                return data;
              });
          }
        }

        enqueueSnackbarWithSuccess("Cập nhật đối tác thành công");

        onSuccessHandler();

        if (isMounted()) {
          setIsUpdateMode(false);
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    [onSuccessHandler]
  );

  const renderStoreCategory = useMemo(() => {
    if (data == undefined) {
      return null;
    }

    return (
      <Controller
        control={control}
        name="store_category"
        render={(props) => {
          const { field, fieldState } = props;
          const { value, onChange } = field;
          const { error } = fieldState;

          return (
            <Autocomplete
              value={value as any}
              onChange={(_, value) => onChange(value)}
              options={data.results}
              getOptionLabel={(option) => option.name}
              readOnly={isUpdateMode ? false : true}
              disabled={isUpdateMode ? false : true}
              renderInput={(props) => {
                return (
                  <InputForAutocomplete
                    {...props}
                    label="Danh mục"
                    placeholder="Danh mục"
                    error={!!error}
                    errorMessage={error && error.message}
                  />
                );
              }}
            />
          );
        }}
      />
    );
  }, [data, isUpdateMode]);

  const onToggleUpdateHandler = useCallback((isUpdateMode: boolean) => {
    return () => {
      if (isUpdateMode) {
        reset(defaultValues, {
          keepDirty: false,
        });
        setIsUpdateMode(false);
      } else {
        router.push(`/${PATHNAME.DOI_TAC}/${PATHNAME.TAI_KHOAN}`);
      }
    };
  }, []);

  return (
    <Container>
      <Stack spacing={3}>
        <BoxWithShadow>
          <Grid container spacing={2} marginBottom={3}>
            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                Thông tin đối tác
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Controller
                control={control}
                name="last_name"
                render={(props) => {
                  return (
                    <FormControlV2
                      label="Họ"
                      placeholder="Họ"
                      controlState={props}
                      InputProps={{
                        readOnly: isUpdateMode ? false : true,
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
                        readOnly: isUpdateMode ? false : true,
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
                      label="Trạng thái"
                      controlState={props}
                      checkboxLabel={props.field.value ? "Hoạt động" : "Không hoạt động"}
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
            <Grid item xs={6}>
              <Controller
                control={control}
                name="phone_number"
                render={(props) => {
                  return (
                    <FormControlForPhoneNumberV2
                      controlState={props}
                      InputProps={{
                        readOnly: isUpdateMode ? false : true,
                      }}
                      FormLabelProps={{
                        children: "Số điện thoại",
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={6}>
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
                name="line"
                control={partnerAddressControl}
                render={(props) => {
                  return (
                    <FormControlV2
                      label="Địa chỉ"
                      placeholder="Địa chỉ"
                      controlState={props}
                      InputProps={{
                        readOnly: isUpdateMode ? false : true,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={3}>
              <Controller
                name="province"
                control={partnerAddressControl}
                render={(props) => {
                  return (
                    <Province
                      controlState={props}
                      onChange={() => {
                        partnerAddressSetValue("district", null);
                        partnerAddressSetValue("ward", null);
                      }}
                      readOnly={isUpdateMode ? false : true}
                      disabled={isUpdateMode ? false : true}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={3}>
              <Controller
                name="district"
                control={partnerAddressControl}
                render={(props) => {
                  const provinceTuple = partnerAddressWatch("province");

                  return (
                    <District
                      controlState={props}
                      province={provinceTuple ? provinceTuple[0] : undefined}
                      onChange={() => {
                        partnerAddressSetValue("ward", null);
                      }}
                      readOnly={isUpdateMode ? false : true}
                      disabled={isUpdateMode ? false : true}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={3}>
              <Controller
                name="ward"
                control={partnerAddressControl}
                render={(props) => {
                  const provinceTuple = partnerAddressWatch("province");
                  const districtTuple = partnerAddressWatch("district");

                  return (
                    <Ward
                      controlState={props}
                      province={provinceTuple ? provinceTuple[0] : undefined}
                      district={districtTuple ? districtTuple[0] : undefined}
                      readOnly={isUpdateMode ? false : true}
                      disabled={isUpdateMode ? false : true}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={3}>
              <Controller
                control={control}
                name="account_number"
                render={(props) => {
                  return (
                    <FormCreditCard
                      controlState={props}
                      label="Số Tài Khoản"
                      placeholder="Số Tài Khoản"
                      readOnly={isUpdateMode ? false : true}
                      NumberFormatProps={{
                        thousandSeparator: false,
                        format: "#### #### #### ####",
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={3}>
              <Controller
                control={control}
                name="owner_name"
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Chủ Tài Khoản"
                      placeholder="Chủ Tài Khoản"
                      InputProps={{
                        readOnly: isUpdateMode ? false : true,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={3}>
              <Controller
                name="bank_name"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Tên Ngân Hàng"
                      placeholder="Tên Ngân Hàng"
                      InputProps={{
                        readOnly: isUpdateMode ? false : true,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={3}>
              <Controller
                control={control}
                name="bank_branch"
                render={(props) => {
                  return (
                    <FormControlV2
                      label="Chi Nhánh"
                      placeholder="Chi Nhánh"
                      controlState={props}
                      InputProps={{
                        readOnly: isUpdateMode ? false : true,
                      }}
                    />
                  );
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} marginBottom={3}>
            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                Thông tin quán
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Controller
                control={control}
                name="store_name"
                render={(props) => {
                  return (
                    <FormControlV2
                      label="Tên Quán"
                      placeholder="Tên Quán"
                      controlState={props}
                      InputProps={{
                        readOnly: isUpdateMode ? false : true,
                      }}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={4}>
              {renderStoreCategory}
            </Grid>
            <Grid item xs={4}>
              <Controller
                control={control}
                name="store_is_active"
                render={(props) => {
                  return (
                    <CheckboxSingleChoice
                      label="Trạng thái"
                      controlState={props}
                      checkboxLabel={props.field.value ? "Hoạt động" : "Không hoạt động"}
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

            <Grid item xs={4}>
              <FormControlBase
                InputProps={{
                  readOnly: true,
                  placeholder: "Tên Đăng Nhập",
                  value: dirtyFields.store_name
                    ? slugify(watch("store_name"), {
                        locale: "vi",
                        lower: true,
                        replacement: "",
                      })
                    : defaultValues.storeSlug,
                }}
                FormLabelProps={{
                  children: "Tên Đăng Nhập",
                }}
              />
            </Grid>

            <Grid item xs={4}></Grid>

            <Grid item xs={4}>
              <Controller
                control={control}
                name="store_is_published"
                render={(props) => {
                  return (
                    <CheckboxSingleChoice
                      label="Hiển thị"
                      controlState={props}
                      checkboxLabel={props.field.value ? "Hiển thị" : "Không hiển thị"}
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
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                Ghi Chú
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="note"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      label="Nội dung"
                      placeholder="Ghi Chú"
                      controlState={props}
                      InputProps={{
                        multiline: true,
                        rows: 10,
                        sx: {
                          padding: 1,
                        },
                        readOnly: isUpdateMode ? false : true,
                      }}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlBase
                InputProps={{
                  readOnly: true,
                  placeholder: "Người kích hoạt",
                  defaultValue: watch("activated_by_person_name"),
                }}
                FormLabelProps={{
                  children: "Người kích hoạt",
                }}
              />
            </Grid>
          </Grid>
        </BoxWithShadow>
        <Stack flexDirection="row" columnGap={2} justifyContent="center">
          <Button
            variant="outlined"
            disabled={loading}
            onClick={onToggleUpdateHandler(isUpdateMode)}
          >
            {BUTTON.BACK}
          </Button>

          {hasPermission && (
            <LoadingButton
              onClick={() => {
                if (isUpdateMode) {
                  handleSubmit((data) => {
                    partnerAddressHandleSubmit((addressData) => {
                      onSubmit({
                        data,
                        addressData,
                        dirtyData: dirtyFields,
                        dirtyAddressData: partnerAddressDirtyFields,
                      });
                    })();
                  })();
                } else {
                  setIsUpdateMode(true);
                }
              }}
              loading={loading}
            >
              {isUpdateMode ? BUTTON.COMPLETE : BUTTON.UPDATE}
            </LoadingButton>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

export default DetailPartner;
