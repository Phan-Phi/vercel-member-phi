import { useMountedState } from "react-use";
import { Controller, useForm } from "react-hook-form";
import { useState, useMemo, useCallback } from "react";

import {
  Box,
  Input,
  Stack,
  styled,
  Button,
  FormLabel,
  Typography,
  FormControl,
  FormHelperText,
} from "@mui/material";

import {
  forgotPasswordSchema,
  ForgotPasswordSchemaProps,
  defaultForgotPasswordFormState,
} from "yups";

import axios from "axios.config";
import { BUTTON } from "constant";
import { FORGOT_PASSWORD } from "apis";
import { useNotification } from "hooks";
import { LoadingButton } from "components";

const ForgotPassword = () => {
  const { loading, setLoading, enqueueSnackbarWithError, enqueueSnackbarWithSuccess } =
    useNotification();

  const isMounted = useMountedState();

  const { handleSubmit, control } = useForm({
    resolver: forgotPasswordSchema(),
    defaultValues: defaultForgotPasswordFormState(),
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const onSendRequestHandler = useCallback(async (data: ForgotPasswordSchemaProps) => {
    try {
      setLoading(true);

      await axios.post(FORGOT_PASSWORD, data);

      enqueueSnackbarWithSuccess("Gửi yêu cầu thành công");

      setIsSuccess(true);
    } catch (err) {
      enqueueSnackbarWithError(err);
    } finally {
      isMounted() && setLoading(false);
    }
  }, []);

  const renderContent = useMemo(() => {
    if (isSuccess) {
      return (
        <Stack spacing={2}>
          <Typography
            color="primary2.main"
            sx={{
              textAlign: "center",
            }}
          >
            Vui lòng kiểm tra email và thực hiện theo hướng dẫn để cài lại mật khẩu
          </Typography>

          <Button
            href="/"
            sx={{
              alignSelf: "center",
            }}
          >
            Quay lại trang chủ
          </Button>
        </Stack>
      );
    } else {
      return (
        <Stack spacing={2}>
          <Typography
            color="primary2.main"
            sx={{
              textAlign: "center",
            }}
          >
            Vui lòng nhập email liên kết với tài khoản để đặt lại mật khẩu
          </Typography>

          <Controller
            name="email"
            control={control}
            render={(state) => {
              const {
                field: { value, onChange },
                fieldState: { error },
              } = state;

              return (
                <Stack spacing={1}>
                  <StyledFormControl error={!!error}>
                    <StyledFormLabel>Email</StyledFormLabel>
                    <Input
                      placeholder="Nhập email"
                      sx={{ flexGrow: 1 }}
                      value={value}
                      onChange={onChange}
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
            loading={loading}
            disabled={loading}
            onClick={handleSubmit(onSendRequestHandler)}
          >
            {BUTTON.SEND}
          </LoadingButton>
        </Stack>
      );
    }
  }, [isSuccess, loading]);

  return (
    <Wrapper>
      <Box flexGrow={1} display="flex" alignItems="center">
        <Box boxShadow={2} padding={5} width={600} borderRadius={2.5}>
          {renderContent}
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
    paddingRight: 16,
  };
});

export default ForgotPassword;
