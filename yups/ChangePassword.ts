import { string, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ChoiceType } from "interfaces";

import { validateConfirmPassword } from "./utils";

export interface ChangePasswordSchemaProps {
  old_password: string;
  password: string;
  confirm_password: string;
}

export const changePasswordSchema = (choice?: ChoiceType) => {
  if (choice) {
    return yupResolver(
      object().shape({
        old_password: string().required(),
        password: string().min(8, "Mật khẩu phải ít nhất ${min} kí tự").required(),
        confirm_password: validateConfirmPassword().min(
          8,
          "Mật khẩu phải ít nhất ${min} kí tự"
        ),
      })
    );
  } else {
    return yupResolver(
      object().shape({
        old_password: string().required(),
        password: string().min(8, "Mật khẩu phải ít nhất ${min} kí tự").required(),
        confirm_password: validateConfirmPassword().min(
          8,
          "Mật khẩu phải ít nhất ${min} kí tự"
        ),
      })
    );
  }
};

export const defaultChangePasswordFormState = (): ChangePasswordSchemaProps => {
  return {
    old_password: "",
    password: "",
    confirm_password: "",
  };
};
