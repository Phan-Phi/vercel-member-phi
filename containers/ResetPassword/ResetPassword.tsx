import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { Controller, useForm } from "react-hook-form";
import { useState, useCallback, useMemo, Fragment, useEffect } from "react";

import {
  Box,
  Stack,
  Button,
  styled,
  FormLabel,
  Typography,
  FormControl,
  FormHelperText,
} from "@mui/material";

import { BUTTON } from "constant";

import { get, isEmpty } from "lodash";
import { useNotification } from "hooks";
import { LoadingButton, InputPassword } from "components";

import {
  resetPasswordSchema,
  ResetPasswordSchemaProps,
  defaultResetPasswordFormState,
} from "yups";

import { RESET_PASSWORD } from "apis";

import axios from "axios.config";

const ResetPassword = () => {
  const router = useRouter();

  const isMounted = useMountedState();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { handleSubmit, reset, control, setValue } = useForm({
    resolver: resetPasswordSchema(),
    defaultValues: defaultResetPasswordFormState(),
  });

  useEffect(() => {
    const searchParams = router.query;

    if (isEmpty(searchParams)) return;

    const token = get(searchParams, "token");
    const email = get(searchParams, "email");

    if (token && email) {
      setValue("email", email as string);
      setValue("token", token as string);
    }
  }, []);

  const onSubmitHandler = useCallback(async (data: ResetPasswordSchemaProps) => {
    try {
      setLoading(true);

      await axios.post(RESET_PASSWORD, data);

      enqueueSnackbarWithSuccess("Tạo mật khẩu mới thành công");

      setIsSuccess(true);

      reset(defaultResetPasswordFormState());
    } catch (err) {
      enqueueSnackbarWithError(err);
    } finally {
      isMounted() && setLoading(false);
    }
  }, []);

  const renderContent = useMemo(() => {
    if (isSuccess) {
      return (
        <Fragment>
          <Typography color="primary2.main" textAlign="center">
            Đổi mật khẩu thành công, xin vui lòng sử dụng mật khẩu mới để đăng nhập lại
          </Typography>

          <Button
            href="/"
            sx={{
              width: "fit-content",
              alignSelf: "center",
            }}
          >
            Quay về trang chủ
          </Button>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <Typography color="primary2.main">Vui lòng nhập nhập mật khẩu mới</Typography>

          <Controller
            control={control}
            name="password"
            render={(state) => {
              const {
                field: { value, onChange },
                fieldState: { error },
              } = state;

              return (
                <Stack spacing={1}>
                  <StyledFormControl>
                    <StyledFormLabel>Mật khẩu mới</StyledFormLabel>
                    <InputPassword
                      value={value}
                      onChange={onChange}
                      placeholder="Nhập mật khẩu mới..."
                    />
                  </StyledFormControl>
                  {error && (
                    <FormHelperText error={!!error}>{error.message}</FormHelperText>
                  )}
                </Stack>
              );
            }}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={(state) => {
              const {
                field: { value, onChange },
                fieldState: { error },
              } = state;

              return (
                <Stack spacing={1}>
                  <StyledFormControl>
                    <StyledFormLabel>Xác nhận mật khẩu mới</StyledFormLabel>
                    <InputPassword
                      value={value}
                      onChange={onChange}
                      placeholder="Xác nhận lại mật khẩu mới..."
                    />
                  </StyledFormControl>
                  {error && (
                    <FormHelperText error={!!error}>{error.message}</FormHelperText>
                  )}
                </Stack>
              );
            }}
          />

          <LoadingButton
            sx={{
              width: "6rem",
              alignSelf: "flex-end",
            }}
            onClick={handleSubmit(onSubmitHandler)}
            loading={loading}
            disabled={loading}
          >
            {BUTTON.SEND}
          </LoadingButton>
        </Fragment>
      );
    }
  }, [isSuccess, loading]);

  return (
    <Wrapper>
      <Box flexGrow={1} display="flex" alignItems="center">
        <Box boxShadow={2} padding={5} width={800} borderRadius={2.5}>
          <Stack spacing={2}>{renderContent}</Stack>
        </Box>
      </Box>

      <Box>
        <Typography
          sx={{
            color: "primary2.main",
            fontWeight: 700,
            paddingBottom: 2,
          }}
        >
          ©2022 Doi Diem. All rights reserved
        </Typography>
      </Box>
    </Wrapper>
  );
};

const Wrapper = styled(Box)({
  width: "100%",
  maxWidth: "100vw",
  minHeight: "calc(100vh - 64px)",
  maxHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
});

const StyledFormControl = styled(FormControl)(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  };
});

const StyledFormLabel = styled(FormLabel)(({ theme }) => {
  return {
    color: theme.palette.primary2.main,
    fontWeight: 700,
    paddingRight: 8,
    minWidth: 180,
  };
});

export default ResetPassword;
