import { string, object, bool, date } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ChoiceType } from "interfaces";

import { isDevelopment } from "yups";

import Chance from "chance";

const chance = new Chance();

export interface CustomerProps {
  email: string;
  birthday: Date | null;
  is_active: boolean;
  first_name?: string;
  last_name?: string;
  gender?: string;
  phone_number?: string;
  address?: string;
  province?: string;
  district?: string;
  ward?: string;
  self?: string;
  wallet?: string;
  memberships?: string;
  orders?: string;
}

export const customerSchema = (choice?: ChoiceType) => {
  if (choice) {
    return yupResolver(
      object().shape({
        email: string().email().required(),
        birthday: date().nullable(),
        is_active: bool(),
      })
    );
  } else {
    return yupResolver(
      object().shape({
        email: string().email().required(),
        birthday: date().nullable(),
        is_active: bool(),
      })
    );
  }
};

export const defaultCustomerFormState = (choice?: ChoiceType): CustomerProps => {
  if (choice) {
    return {
      email: isDevelopment ? chance.email() : "",
      birthday: isDevelopment ? null : null,
      is_active: true,
    };
  } else {
    return {
      email: isDevelopment ? chance.email() : "",
      birthday: isDevelopment ? null : null,
      is_active: true,
    };
  }
};
