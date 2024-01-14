import useSWR from "swr";
import { useRouter } from "next/router";
import { isEmpty, get, set, cloneDeep } from "lodash";
import { Controller, useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Container, Grid, Button, Box, Stack, Typography, styled } from "@mui/material";

import axios from "axios.config";
import { BUTTON, INPUT_PROPS } from "constant";
import { PATHNAME } from "routes";
import { useNotification } from "hooks";
import { responseSchema, SETTINGS_ITEM } from "interfaces";
import { SETTINGS } from "apis";
import {
  notificationSettingSchema,
  NotificationSettingSchemaProps,
  defaultNotificationSettingFormState,
} from "yups";

import {
  Loading,
  BoxWithShadow,
  LoadingButton,
  FormControlV2,
  FormControlForNumberV2,
  FormControlForPhoneNumberV2,
} from "components";
import { transformUrl } from "libs";

const POINT_NOTIFICATION_TEMPLATE = [
  "{{transaction_type_display}}: Loại giao dịch",
  "{{target_name}}: Tên đối tượng",
  "{{transaction_amount}}: Điểm giao dịch",
];

const BELOW_THRESHOLD_TEMPLATE = ["{{balance}}: Điểm"];

export default function ConfigNotificationUpdate() {
  const router = useRouter();

  const [defaultValues, setDefaultValues] = useState<NotificationSettingSchemaProps>();

  const { data: resSettingData, mutate: settingMutate } = useSWR<SETTINGS_ITEM>(
    transformUrl(SETTINGS, {
      use_cache: false,
    })
  );

  const setDefaultValuesHandler = useCallback((data: SETTINGS_ITEM) => {
    const body = {} as NotificationSettingSchemaProps;

    const keyList = Object.keys(defaultNotificationSettingFormState());

    keyList.forEach((key) => {
      let temp = get(data, key);

      if (key === "store_notification_period") {
        temp = temp / (60 * 60 * 24);
      }

      set(body, key, temp);
    });

    setDefaultValues(body);
  }, []);

  useEffect(() => {
    if (resSettingData == undefined) return;

    setDefaultValuesHandler(resSettingData);
  }, [resSettingData]);

  const onSuccessHandler = useCallback(async () => {
    await Promise.all([settingMutate()]);
    router.back();
  }, []);

  if (defaultValues == undefined) {
    return <Loading />;
  }

  return <RootComponent {...{ defaultValues, onSuccessHandler }} />;
}

interface RootComponentProps {
  defaultValues: NotificationSettingSchemaProps;
  onSuccessHandler: () => Promise<void>;
}

const RootComponent = (props: RootComponentProps) => {
  const { defaultValues, onSuccessHandler } = props;

  const router = useRouter();
  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const {
    handleSubmit,
    control,
    formState: { dirtyFields },
  } = useForm({
    resolver: notificationSettingSchema(),
    defaultValues,
  });

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: NotificationSettingSchemaProps;
      dirtyFields: object;
    }) => {
      const transformedData = cloneDeep(data);
      const storeNotificationPeriod = get(transformedData, "store_notification_period");

      set(
        transformedData,
        "store_notification_period",
        parseInt(storeNotificationPeriod) * (60 * 60 * 24)
      );

      try {
        setLoading(true);

        if (!isEmpty(dirtyFields)) {
          await axios.patch(SETTINGS, transformedData);
        }

        enqueueSnackbarWithSuccess("Cập nhật thông báo thành công");
        onSuccessHandler();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    []
  );

  const onGoBackHandler = useCallback(() => {
    router.push(`/${PATHNAME.CAI_DAT}/${PATHNAME.CAU_HINH}`);
  }, []);

  const renderIncreasePointTemplate = useMemo(() => {
    return (
      <Controller
        name="increase_point_notification_template"
        control={control}
        render={(props) => {
          return (
            <FormControlV2
              controlState={props}
              label="Nội dung thông báo tích điểm"
              placeholder="Nội dung thông báo tích điểm"
              FormHelperTextProps={{
                children: POINT_NOTIFICATION_TEMPLATE.map((el) => {
                  return (
                    <Typography
                      key={el}
                      component="span"
                      display="block"
                      marginBottom={1}
                    >
                      {el}
                    </Typography>
                  );
                }),
                sx: {
                  marginTop: 2,
                },
              }}
            />
          );
        }}
      />
    );
  }, []);

  const renderDecreasePointTemplate = useMemo(() => {
    return (
      <Controller
        name="decrease_point_notification_template"
        control={control}
        render={(props) => {
          return (
            <FormControlV2
              controlState={props}
              label="Nội dung thông báo trừ điểm"
              placeholder="Nội dung thông báo trừ điểm"
              FormHelperTextProps={{
                children: POINT_NOTIFICATION_TEMPLATE.map((el) => {
                  return (
                    <Typography
                      key={el}
                      component="span"
                      display="block"
                      marginBottom={1}
                    >
                      {el}
                    </Typography>
                  );
                }),
                sx: {
                  marginTop: 2,
                },
              }}
            />
          );
        }}
      />
    );
  }, []);

  const renderBelowThresholdTemplate = useMemo(() => {
    return (
      <Controller
        name="below_threshold_notification_template"
        control={control}
        render={(props) => {
          return (
            <FormControlV2
              controlState={props}
              label="Nội dung thông báo điểm thấp"
              placeholder="Nội dung thông báo điểm thấp"
              FormHelperTextProps={{
                children: BELOW_THRESHOLD_TEMPLATE.map((el) => {
                  return (
                    <Typography
                      key={el}
                      component="span"
                      display="block"
                      marginBottom={1}
                    >
                      {el}
                    </Typography>
                  );
                }),
                sx: {
                  marginTop: 2,
                },
              }}
            />
          );
        }}
      />
    );
  }, []);

  return (
    <Container>
      <Stack spacing={3}>
        <BoxWithShadow>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                Tần Suất
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Controller
                control={control}
                name="store_notification_period"
                render={(props) => {
                  return (
                    <FormControlForNumberV2
                      // InputProps={{
                      //   endAdornment: (
                      //     <StyledEndAdornment>
                      //       <Typography>ngày</Typography>
                      //     </StyledEndAdornment>
                      //   ),
                      // }}
                      labelEndAdornment="ngày"
                      label="Chu kỳ gửi thông báo:"
                      placeholder="Nhập số ngày.."
                      controlState={props}
                      NumberFormatProps={{
                        thousandSeparator: false,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={6}></Grid>

            <Grid item xs={6}>
              <Controller
                control={control}
                name="store_notification_quantity_in_period"
                render={(props) => {
                  return (
                    <FormControlForNumberV2
                      // InputProps={{
                      //   endAdornment: (
                      //     <StyledEndAdornment>
                      //       <Typography>lượt</Typography>
                      //     </StyledEndAdornment>
                      //   ),
                      // }}
                      labelEndAdornment="lượt"
                      label="Số lượt mỗi chu kỳ:"
                      placeholder="Nhập số lượt..."
                      controlState={props}
                      NumberFormatProps={{
                        thousandSeparator: false,
                      }}
                    />
                  );
                }}
              />
            </Grid>
          </Grid>
        </BoxWithShadow>

        <BoxWithShadow>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                Nội dung từ hệ thống thông báo
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="increase_point_notification_title"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      placeholder="Tiêu đề thông báo tích điểm"
                      label="Tiêu đề thông báo tích điểm"
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              {renderIncreasePointTemplate}
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="decrease_point_notification_title"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Tiêu đề thông báo trừ điểm"
                      placeholder="Tiêu đề thông báo trừ điểm"
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {renderDecreasePointTemplate}
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="below_threshold_notification_title"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Tiêu đề thông báo điểm thấp"
                      placeholder="Tiêu đề thông báo điểm thấp"
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              {renderBelowThresholdTemplate}
            </Grid>
          </Grid>
        </BoxWithShadow>

        <BoxWithShadow>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                Email Template
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Controller
                control={control}
                name="hotline"
                render={(props) => {
                  return (
                    <FormControlForPhoneNumberV2
                      controlState={props}
                      FormLabelProps={{
                        children: "Hotline",
                      }}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="contact_email"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Email liên hệ"
                      placeholder="Email liên hệ"
                      InputProps={{
                        type: "email",
                      }}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="email_sender_name"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Tên người gửi email"
                      placeholder="Tên người gửi email"
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="email_sender"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Người gửi"
                      placeholder="Người gửi"
                      InputProps={{
                        type: "email",
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="admin_create_password_email_subject"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Tiêu đề thiết lập mật khẩu tài khoản nhân viên"
                      placeholder="Tiêu đề thiết lập mật khẩu tài khoản nhân viên"
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="admin_create_password_email_template"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Thiết lập mật khẩu tài khoản nhân viên"
                      placeholder="Thiết lập mật khẩu tài khoản nhân viên"
                      InputProps={{
                        ...INPUT_PROPS,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="admin_reset_password_email_subject"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Tiêu đề đặt lại mật khẩu tài khoản nhân viên"
                      placeholder="Tiêu đề đặt lại mật khẩu tài khoản nhân viên"
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="admin_reset_password_email_template"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Đặt lại mật khẩu tài khoản nhân viên"
                      placeholder="Đặt lại mật khẩu tài khoản nhân viên"
                      InputProps={{
                        ...INPUT_PROPS,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="cashier_create_password_email_subject"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Tiêu đề thiết lập mật khẩu tài khoản nhân viên đối tác"
                      placeholder="Tiêu đề thiết lập mật khẩu tài khoản nhân viên đối tác"
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="cashier_create_password_email_template"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Thiết lập mật khẩu tài khoản nhân viên đối tác"
                      placeholder="Thiết lập mật khẩu tài khoản nhân viên đối tác"
                      InputProps={{
                        ...INPUT_PROPS,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="merchant_create_password_email_subject"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Tiêu đề thiết lập mật khẩu tài khoản đối tác"
                      placeholder="Tiêu đề thiết lập mật khẩu tài khoản đối tác"
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="merchant_create_password_email_template"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Thiết lập mật khẩu tài khoản đối tác"
                      placeholder="Thiết lập mật khẩu tài khoản đối tác"
                      InputProps={{
                        ...INPUT_PROPS,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="merchant_or_cashier_reset_password_email_subject"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Tiêu đề thiết lập mật khẩu tài khoản đối tác hoặc nhân viên đối tác"
                      placeholder="Tiêu đề thiết lập mật khẩu tài khoản đối tác hoặc nhân viên đối tác"
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="merchant_or_cashier_reset_password_email_template"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Thiết lập mật khẩu tài khoản đối tác hoặc nhân viên đối tác"
                      placeholder="Thiết lập mật khẩu tài khoản đối tác hoặc nhân viên đối tác"
                      InputProps={{
                        ...INPUT_PROPS,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="merchant_wallet_below_threshold_email_subject"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Tiêu đề thông báo tài khoản đối tác thấp điểm"
                      placeholder="Tiêu đề thông báo tài khoản đối tác thấp điểm"
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="merchant_wallet_below_threshold_email_template"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Thông báo tài khoản đối tác thấp điểm"
                      placeholder="Thông báo tài khoản đối tác thấp điểm"
                      InputProps={{
                        ...INPUT_PROPS,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="customer_verify_email_subject"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Tiêu đề xác thực email khách hàng"
                      placeholder="Tiêu đề xác thực email khách hàng"
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="customer_verify_email_template"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Xác thực email khách hàng"
                      placeholder="Xác thực email khách hàng"
                      InputProps={{
                        ...INPUT_PROPS,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="customer_reset_password_email_subject"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Tiêu đề đặt lại mật khẩu tài khoản khách hàng"
                      placeholder="Tiêu đề đặt lại mật khẩu tài khoản khách hàng"
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="customer_reset_password_email_template"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Đặt lại mật khẩu tài khoản khách hàng"
                      placeholder="Đặt lại mật khẩu tài khoản khách hàng"
                      InputProps={{
                        ...INPUT_PROPS,
                      }}
                    />
                  );
                }}
              />
            </Grid>
          </Grid>
        </BoxWithShadow>

        <Stack flexDirection="row" columnGap={2} justifyContent="center">
          <Button variant="outlined" disabled={loading} onClick={onGoBackHandler}>
            {BUTTON.BACK}
          </Button>

          <LoadingButton
            type="submit"
            onClick={handleSubmit(
              (data) => {
                onSubmit({
                  data,
                  dirtyFields,
                });
              },
              (err) => {}
            )}
            loading={loading}
          >
            {BUTTON.UPDATE}
          </LoadingButton>
        </Stack>
      </Stack>
    </Container>
  );
};
const StyledEndAdornment = styled(Box)(({ theme }) => {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E6E6E6",
    width: "65px !important",
    height: "2.5rem",
  };
});
