import { string, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ChoiceType } from "interfaces";

export interface LoginSchemaProps {
  username: string;
  password: string;
}

export const loginSchema = (choice?: ChoiceType) => {
  if (choice) {
    return yupResolver(
      object().shape({
        username: string().required(),
        password: string().required(),
      })
    );
  } else {
    return yupResolver(
      object().shape({
        username: string().required(),
        password: string().required(),
      })
    );
  }
};

export const defaultLoginFormState = (choice?: ChoiceType): LoginSchemaProps => {
  if (choice) {
    return {
      username: "",
      password: "",
    };
  } else {
    return {
      username: "",
      password: "",
    };
  }
};
