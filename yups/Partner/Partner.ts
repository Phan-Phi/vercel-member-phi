import { string, object, bool, date, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { validatePhoneNumber } from "yups/utils";

import { ChoiceType } from "interfaces";

import { getChoiceValue } from "libs";

import { isDevelopment } from "yups";

import Chance from "chance";

const chance = new Chance();

export interface PartnerProps {
  is_active: boolean;
  account_number: string;
  owner_name: string;
  bank_name: string;
  bank_branch: string;
  store_name: string;
  store_category: object | null;
  store_is_active: boolean;
  store_is_published: boolean;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  birthday: Date | null;
  gender: string;
  note: string;
  self?: string;
  bankSelf?: string;
  activated_by_person_name?: string;
  storeSelf?: string;
  storeSlug?: string;
}

export const partnerSchema = (choice?: ChoiceType) => {
  if (choice) {
    const { genders } = choice;

    return yupResolver(
      object().shape({
        is_active: bool(),
        account_number: string().required(),
        owner_name: string().required(),
        bank_name: string().required(),
        bank_branch: string().required(),
        store_name: string().required(),
        store_category: mixed().required(),
        store_is_active: bool(),
        store_is_published: bool(),
        email: string().email().required(),
        phone_number: validatePhoneNumber().required(),
        first_name: string(),
        last_name: string(),
        birthday: date().nullable(),
        gender: string().oneOf(getChoiceValue(genders)),
        note: string(),
      })
    );
  } else {
    return yupResolver(
      object().shape({
        is_active: bool(),
        account_number: string().required(),
        owner_name: string().required(),
        bank_name: string().required(),
        bank_branch: string().required(),
        store_name: string().required(),
        store_category: mixed().required(),
        store_is_active: bool(),
        store_is_published: bool(),
        email: string().email().required(),
        phone_number: validatePhoneNumber().required(),
        first_name: string(),
        last_name: string(),
        birthday: date().nullable(),
        gender: string(),
        note: string(),
      })
    );
  }
};

export const defaultPartnerFormState = (choice?: ChoiceType): PartnerProps => {
  if (choice) {
    const { genders } = choice;

    return {
      is_active: true,
      account_number: isDevelopment
        ? chance
            .integer({
              min: 1111111111111,
              max: 9999999999991,
            })
            .toString()
        : "",
      owner_name: isDevelopment ? chance.name({ middle_initial: true }) : "",
      bank_name: isDevelopment ? chance.name() : "",
      bank_branch: isDevelopment ? chance.name({ middle: true }) : "",
      store_name: isDevelopment ? chance.name({ nationality: "en" }) : "",
      store_category: null,
      store_is_active: true,
      store_is_published: true,
      email: isDevelopment ? chance.email() : "",
      phone_number: isDevelopment
        ? `+84${chance.integer({
            min: 771111111,
            max: 779999999,
          })}`
        : "",
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
      birthday: isDevelopment ? null : null,
      gender: "Others",
      note: isDevelopment
        ? chance.word({
            length: 50,
          })
        : "",
    };
  } else {
    return {
      is_active: true,
      account_number: "",
      owner_name: "",
      bank_name: "",
      bank_branch: "",
      store_name: "",
      store_category: null,
      store_is_active: true,
      store_is_published: true,
      email: "",
      phone_number: "",
      first_name: "",
      last_name: "",
      birthday: null,
      gender: "",
      note: "",
    };
  }
};
