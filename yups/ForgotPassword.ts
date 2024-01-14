import { string, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export interface ForgotPasswordSchemaProps {
  email: string;
}

export const forgotPasswordSchema = () => {
  return yupResolver(
    object().shape({
      email: string().email().required(),
    })
  );
};

export const defaultForgotPasswordFormState = (): ForgotPasswordSchemaProps => {
  return {
    email: "",
  };
};
