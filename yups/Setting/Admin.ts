import { string, object, bool, date, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { validatePhoneNumber } from "yups/utils";

import { ChoiceType, GROUPS_ITEM } from "interfaces";

import { getChoiceValue } from "libs";

import { isDevelopment } from "yups";

import Chance from "chance";

const chance = new Chance();

export interface AdminSchemaProps {
  self?: string;
  last_name: string;
  first_name: string;
  gender: string;
  is_active: boolean;
  birthday: Date | null;
  phone_number: string;
  email: string;
  add_groups: string[];
  remove_groups: string[];
  groups?: GROUPS_ITEM[];
}

export const adminSchema = (choice?: ChoiceType) => {
  if (choice) {
    const { genders } = choice;

    return yupResolver(
      object().shape({
        phone_number: validatePhoneNumber().required(),
        is_active: bool(),
        gender: string().oneOf(getChoiceValue(genders)),
        birthday: date().nullable(),
        first_name: string().required(),
        last_name: string().required(),
        email: string().email().required(),
        add_groups: mixed(),
        remove_groups: mixed(),
      })
    );
  } else {
    return yupResolver(
      object().shape({
        phone_number: validatePhoneNumber().required(),
        is_active: bool(),
        gender: string(),
        birthday: date().nullable(),
        first_name: string().required(),
        last_name: string().required(),
        email: string().email().required(),
        add_groups: mixed(),
        remove_groups: mixed(),
      })
    );
  }
};

export const defaultAdminFormState = (choice?: ChoiceType): AdminSchemaProps => {
  if (choice) {
    const { genders } = choice;
    const genderValueList = getChoiceValue(genders);
    return {
      phone_number: isDevelopment
        ? `+84${chance.integer({
            min: 771111111,
            max: 779999999,
          })}`
        : "",
      birthday: isDevelopment ? null : null,
      gender: genderValueList[0],
      is_active: true,
      email: isDevelopment ? chance.email() : "",
      first_name: isDevelopment
        ? chance.name({
            prefix: true,
          })
        : "",
      last_name: isDevelopment
        ? chance.name({
            suffix: true,
          })
        : "",
      add_groups: [],
      remove_groups: [],
    };
  } else {
    return {
      phone_number: isDevelopment
        ? `+84${chance.integer({
            min: 771111111,
            max: 779999999,
          })}`
        : "",
      birthday: isDevelopment ? null : null,
      gender: "",
      is_active: true,
      email: "",
      first_name: "",
      last_name: "",
      add_groups: [],
      remove_groups: [],
    };
  }
};
