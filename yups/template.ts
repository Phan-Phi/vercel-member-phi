import { string, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ChoiceType } from "interfaces";

export interface LoginProps {
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

export const defaultLoginFormState = (choice?: ChoiceType): LoginProps => {
  if (choice) {
    return {
      username: "superuserdung@gmail.com",
      password: "12345678",
    };
  } else {
    return {
      username: "superuserdung@gmail.com",
      password: "12345678",
    };
  }
};
