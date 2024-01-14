import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import React, { useMemo, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";

import useSWR from "swr";
import slugify from "slugify";
import axios from "axios.config";
import { get, set } from "lodash";
import { formatISO } from "date-fns";
import { Grid, Typography, Stack, Button, Box, Autocomplete } from "@mui/material";

import {
  Ward,
  Province,
  District,
  Container,
  LoadingButton,
  BoxWithShadow,
  FormControlV2,
  FormControlBase,
  CheckboxSingleChoice,
  InputForAutocomplete,
  FormControlForPhoneNumberV2,
  FormCreditCard,
} from "components";

import {
  PartnerProps,
  partnerSchema,
  PartnerAddressProps,
  partnerAddressSchema,
  defaultPartnerFormState,
  defaultPartnerAddressFormState,
} from "yups";

import { PATHNAME } from "routes";
import { BUTTON } from "constant";
import { useChoice, useNotification } from "hooks";
import { transformUrl, transformArrayAddressToString } from "libs";
import { MERCHANTS_STORES_CATEGORIES_ITEM, responseSchema } from "interfaces";
import { MERCHANTS_STORES_CATEGORIES, MERCHANTS, MERCHANTS_ADDRESSES } from "apis";

const CreatePartner = () => {
  const router = useRouter();
  const choice = useChoice();

  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { data } = useSWR<responseSchema<MERCHANTS_STORES_CATEGORIES_ITEM>>(
    transformUrl(MERCHANTS_STORES_CATEGORIES, {
      limit: 1000,
    })
  );
  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { isValid: isValidPartner },
  } = useForm({
    mode: "onChange",
    resolver: partnerSchema(choice),
    defaultValues: defaultPartnerFormState(choice),
  });

  const {
    control: partnerAddressControl,
    setValue: partnerAddressSetValue,
    reset: partnerAddressReset,
    watch: partnerAddressWatch,
    handleSubmit: partnerAddressHandleSubmit,
    formState: { isValid: isValidAddress },
  } = useForm({
    mode: "onChange",
    resolver: partnerAddressSchema(),
    defaultValues: defaultPartnerAddressFormState(),
  });

  const onSubmit = useCallback(
    async ({
      data,
      addressData,
    }: {
      data: PartnerProps;
      addressData: PartnerAddressProps;
    }) => {
      try {
        setLoading(true);
        const birthday = get(data, "birthday");
        const storeCategory = get(data, "store_category");

        if (birthday) {
          set(data, "birthday", formatISO(birthday));
        }

        if (storeCategory) {
          set(data, "store_category", get(storeCategory, "self"));
        }

        const { data: resData } = await axios.post(MERCHANTS, data);

        const self = get(resData, "self");

        if (self) {
          set(addressData, "user", self);

          addressData = transformArrayAddressToString(addressData);

          await axios.post(MERCHANTS_ADDRESSES, addressData);

          enqueueSnackbarWithSuccess("Tạo đối tác thành công");
        }

        router.push(`/${PATHNAME.DOI_TAC}/${PATHNAME.TAI_KHOAN}`);
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) setLoading(false);
      }
    },
    [enqueueSnackbarWithError, enqueueSnackbarWithSuccess, isMounted, router, setLoading]
  );

  const onResetHandler = useCallback(() => {
    reset(defaultPartnerFormState(choice));
    partnerAddressReset(defaultPartnerAddressFormState(choice));
  }, []);

  const renderStoreCategory = useMemo(() => {
    if (data == undefined) return null;

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
              options={data.results}
              getOptionLabel={(option) => option.name}
              value={value as any}
              onChange={(_, value) => onChange(value)}
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
  }, [data]);

  return (
    <Box component="form">
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
                      <FormControlV2 controlState={props} label="Họ" placeholder="Họ" />
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
                      <FormControlV2 controlState={props} label="Tên" placeholder="Tên" />
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
                        checkboxLabel={
                          props.field.value ? "Hoạt động" : "Không hoạt động"
                        }
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
                    return <FormControlForPhoneNumberV2 controlState={props} />;
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  control={control}
                  name="email"
                  render={(props) => {
                    return (
                      <FormControlV2
                        label="Email"
                        placeholder="Email"
                        controlState={props}
                        InputProps={{
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
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={3}>
                <Controller
                  control={partnerAddressControl}
                  name="province"
                  render={(props) => {
                    return (
                      <Province
                        controlState={props}
                        onChange={() => {
                          partnerAddressSetValue("district", null);
                          partnerAddressSetValue("ward", null);
                        }}
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={3}>
                <Controller
                  control={partnerAddressControl}
                  name="district"
                  render={(props) => {
                    const provinceTuple = partnerAddressWatch("province");

                    return (
                      <District
                        controlState={props}
                        province={provinceTuple ? provinceTuple[0] : undefined}
                        onChange={() => {
                          partnerAddressSetValue("ward", null);
                        }}
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
                        label="Số tài khoản"
                        placeholder="Số Tài Khoản"
                        controlState={props}
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
                  name="owner_name"
                  control={control}
                  render={(props) => {
                    return (
                      <FormControlV2
                        controlState={props}
                        label="Chủ Tài Khoản"
                        placeholder="Chủ Tài Khoản"
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
                        controlState={props}
                        label="Chi Nhánh"
                        placeholder="Chi Nhánh"
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
                        controlState={props}
                        label="Tên Quán"
                        placeholder="Tên Quán"
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
                        controlState={props}
                        label="Trạng thái"
                        checkboxLabel={props.field.value ? "Kích hoạt" : "Chưa kích hoạt"}
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <FormControlBase
                  InputProps={{
                    disabled: true,
                    placeholder: "Tên Đăng Nhập",
                    value: watch("store_name")
                      ? slugify(watch("store_name"), {
                          locale: "vi",
                          lower: true,
                          replacement: "",
                        })
                      : "",
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
                        controlState={props}
                        label="Hiển thị cửa hàng"
                        checkboxLabel={props.field.value ? "Hiển thị" : "Không hiển thị"}
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

              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="note"
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
                        }}
                      />
                    );
                  }}
                />
              </Grid>
            </Grid>
          </BoxWithShadow>
          <Stack flexDirection="row" columnGap={2} justifyContent="center">
            <Button variant="outlined" onClick={router.back}>
              {BUTTON.BACK}
            </Button>

            <Button
              disabled={loading}
              variant="outlined"
              color="error"
              onClick={onResetHandler}
            >
              {BUTTON.RESET}
            </Button>

            <LoadingButton
              type="submit"
              onClick={handleSubmit((data) => {
                partnerAddressHandleSubmit((addressData) => {
                  onSubmit({
                    data,
                    addressData,
                  });
                })();
              })}
              loading={loading}
              disabled={
                !isValidAddress === false && !isValidPartner === false ? false : true
              }
            >
              {BUTTON.CREATE}
            </LoadingButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default CreatePartner;
