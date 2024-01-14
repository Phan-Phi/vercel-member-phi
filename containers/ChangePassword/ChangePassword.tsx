import { useCallback } from "react";
import { signOut } from "next-auth/react";
import { useMountedState } from "react-use";
import { Controller, useForm } from "react-hook-form";

import { Grid, FormControl, Stack, Box, Typography, FormHelperText } from "@mui/material";

import { Container, InputPassword, FormLabel, LoadingButton } from "components";

import axios from "axios.config";
import { useNotification } from "hooks";
import { ME_CHANGE_PASSWORD } from "apis";

import {
  changePasswordSchema,
  ChangePasswordSchemaProps,
  defaultChangePasswordFormState,
} from "yups";

const ChangePassword = () => {
  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { handleSubmit, control } = useForm({
    resolver: changePasswordSchema(),
    defaultValues: defaultChangePasswordFormState(),
  });

  const onSubmit = useCallback(async (data: ChangePasswordSchemaProps) => {
    try {
      setLoading(true);

      await axios.patch(ME_CHANGE_PASSWORD, data);

      enqueueSnackbarWithSuccess("Đổi mật khẩu thành công. Vui lòng đăng nhập lại");

      await signOut();
    } catch (err) {
      enqueueSnackbarWithError(err);
    } finally {
      if (isMounted()) setLoading(false);
    }
  }, []);

  return (
    <Container>
      <Grid container flexDirection="column" alignItems="center">
        <Grid item xs={6} width="100%">
          <Box component="form">
            <Stack spacing={3}>
              <Typography variant="h2" color="primary2.main">
                Thay đổi mật khẩu
              </Typography>

              <Controller
                control={control}
                name="old_password"
                render={({ field }) => {
                  const { value, onChange } = field;

                  return (
                    <FormControl>
                      <FormLabel>Mật khẩu hiện tại</FormLabel>
                      <InputPassword
                        placeholder="Mật khẩu hiện tại"
                        value={value}
                        onChange={onChange}
                      />
                    </FormControl>
                  );
                }}
              />

              <Controller
                control={control}
                name="password"
                render={({ field }) => {
                  const { value, onChange } = field;

                  return (
                    <FormControl>
                      <FormLabel>Mật khẩu mới</FormLabel>
                      <InputPassword
                        placeholder="Mật khẩu mới"
                        value={value}
                        onChange={onChange}
                      />
                    </FormControl>
                  );
                }}
              />

              <Controller
                control={control}
                name="confirm_password"
                render={({ field, fieldState: { error } }) => {
                  const { value, onChange } = field;

                  return (
                    <FormControl error={!!error}>
                      <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                      <InputPassword
                        placeholder="Xác nhận mật khẩu mới"
                        value={value}
                        onChange={onChange}
                      />

                      <FormHelperText>{error?.message}</FormHelperText>
                    </FormControl>
                  );
                }}
              />

              <LoadingButton
                variant="contained"
                sx={{
                  alignSelf: "flex-end",
                }}
                type="submit"
                loading={loading}
                onClick={handleSubmit(onSubmit)}
              >
                Đổi mật khẩu
              </LoadingButton>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChangePassword;
