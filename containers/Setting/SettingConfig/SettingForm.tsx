import { Control, Controller } from "react-hook-form";
import { Grid, styled, Typography, Box } from "@mui/material";
import {
  BoxWithShadow,
  FormControl,
  FormControlForNumber,
  FormControlForNumberV2,
  FormControlV2,
} from "components";

import { SettingSchemaProps } from "yups";
import { CONTENT_GLOBAL } from "constant";

interface SettingFormProps<T extends SettingSchemaProps = SettingSchemaProps> {
  control: Control<T>;
}

const SettingForm = (props: SettingFormProps) => {
  const { control } = props;

  return (
    <BoxWithShadow>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                {CONTENT_GLOBAL.ABOUT}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="introduced_people_point"
                render={(props) => {
                  return (
                    <FormControlForNumberV2
                      labelEndAdornment="điểm"
                      label="Khi tạo tài khoản mới:"
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
            <Grid item xs={12}>
              <Controller
                control={control}
                name="introduce_people_point"
                render={(props) => {
                  return (
                    <FormControlForNumberV2
                      labelEndAdornment="điểm"
                      label="Khi giới thiệu tài khoản:"
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
            <Grid item xs={12}>
              <Controller
                control={control}
                name="non_membership_gift_rate"
                render={(props) => {
                  return (
                    <FormControlForNumberV2
                      labelEndAdornment="%"
                      label="Khi chưa là thành viên:"
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
        </Grid>

        <Grid item xs={4}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                Điểm Thấp
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="wallet_point_low_threshold"
                render={(props) => {
                  return (
                    <FormControlForNumberV2
                      labelEndAdornment="điểm"
                      label="Mức Điểm:"
                      placeholder="Nhập số lượt..."
                      controlState={props}
                      NumberFormatProps={{
                        thousandSeparator: false,
                        allowLeadingZeros: true,
                      }}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="email_notification_wallet_point_low_threshold"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Email Nhận Thông Báo:"
                      placeholder="Nhập email..."
                    />
                  );
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                Phí
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="transaction_fee_rate"
                render={(props) => {
                  return (
                    <FormControlForNumberV2
                      labelEndAdornment="%"
                      label="Phí dịch vụ:"
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

            <Grid item xs={12}>
              <Controller
                control={control}
                name="transaction_fee_rate_for_first_store_of_customer"
                render={(props) => {
                  return (
                    <FormControlForNumberV2
                      labelEndAdornment="%"
                      label="Phí dịch vụ ưu đãi:"
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
        </Grid>
      </Grid>
    </BoxWithShadow>
  );
};

export default SettingForm;
