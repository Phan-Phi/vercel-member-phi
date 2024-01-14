import React, { useCallback } from "react";
import { useMountedState } from "react-use";
import { signIn, useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";

import {
  Box,
  Input,
  Stack,
  styled,
  FormLabel,
  Typography,
  FormControl,
} from "@mui/material";

import { useNotification } from "hooks";
import { LoadingButton, InputPassword, Link } from "components";
import { loginSchema, defaultLoginFormState, LoginSchemaProps } from "yups";

const Login = () => {
  const { status } = useSession();
  const isMounted = useMountedState();

  const {
    loading,
    setLoading,
    enqueueSnackbar,
    enqueueSnackbarWithError,
    enqueueSnackbarWithSuccess,
  } = useNotification();

  const { handleSubmit, control } = useForm({
    resolver: loginSchema(),
    defaultValues: defaultLoginFormState(),
  });

  const onLoginHandler = useCallback(async (data: LoginSchemaProps) => {
    try {
      setLoading(true);

      const status = await signIn("sign-in", {
        ...data,
        redirect: false,
      });

      if (status?.ok) {
        enqueueSnackbarWithSuccess("Đăng nhập thành công!");
      } else {
        enqueueSnackbar("Tên đăng nhập hoặc mật khẩu không đúng", {
          variant: "error",
        });
      }
    } catch (err) {
      enqueueSnackbarWithError(err);
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, []);

  if (status === "authenticated") {
    return null;
  }

  return (
    <Wrapper>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
        }}
        component="form"
      >
        <Box
          sx={{
            padding: 5,
            boxShadow: 2,
            width: "fit-content",
            borderRadius: 2.5,
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h2" color="primary2.main">
              Hệ Thống Quản Lý App Đổi Điểm
            </Typography>
            <Typography
              variant="subtitle1"
              color="primary2.main"
              sx={{
                textAlign: "center",
              }}
            >
              Vui lòng đăng nhập để tiếp tục
            </Typography>

            <Controller
              name="username"
              control={control}
              render={(state) => {
                const {
                  field: { value, onChange },
                } = state;

                return (
                  <StyledFormControl>
                    <StyledFormLabel>SĐT/Email</StyledFormLabel>
                    <Input
                      placeholder="Nhập email hoặc số điện thoại..."
                      sx={{ flexGrow: 1 }}
                      value={value}
                      onChange={onChange}
                    />
                  </StyledFormControl>
                );
              }}
            />

            <Link
              href="/quen-mat-khau"
              variant="subtitle1"
              fontWeight={700}
              textAlign="right"
              color="#000"
            >
              Quên mật khẩu?
            </Link>

            <Controller
              name="password"
              control={control}
              render={(state) => {
                const {
                  field: { value, onChange },
                } = state;

                return (
                  <StyledFormControl>
                    <StyledFormLabel>Mật khẩu</StyledFormLabel>
                    <InputPassword value={value} onChange={onChange} />
                  </StyledFormControl>
                );
              }}
            />

            <LoadingButton
              variant="contained"
              sx={{
                width: "fit-content",
                alignSelf: "flex-end",
              }}
              type="submit"
              loading={loading}
              onClick={handleSubmit(onLoginHandler)}
            >
              Đăng nhập
            </LoadingButton>
          </Stack>
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
    minWidth: 120,
  };
});

export default Login;
