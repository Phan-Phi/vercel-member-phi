import { string, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { validateConfirmPassword } from "./utils";

export interface ResetPasswordSchemaProps {
  password: string;
  confirm_password: string;
  token?: string;
  email?: string;
}

export const resetPasswordSchema = () => {
  return yupResolver(
    object().shape({
      password: string().min(8, "Mật khẩu phải ít nhất ${min} kí tự").required(),
      confirm_password: validateConfirmPassword().min(
        8,
        "Mật khẩu phải ít nhất ${min} kí tự"
      ),
    })
  );
};

export const defaultResetPasswordFormState = (): ResetPasswordSchemaProps => {
  return {
    password: "",
    confirm_password: "",
    token: "",
    email: "",
  };
};
