import { string, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ChoiceType } from "interfaces";

import { isDevelopment } from "yups";

import Chance from "chance";

const chance = new Chance();

export interface SettingSchemaProps {
  transaction_fee_rate: string;
  transaction_fee_rate_for_first_store_of_customer: string;
  introduce_people_point: string;
  introduced_people_point: string;
  non_membership_gift_rate: string;
  wallet_point_low_threshold: string;
  email_notification_wallet_point_low_threshold: string;
}

export const settingSchema = (choice?: ChoiceType) => {
  if (choice) {
    return yupResolver(
      object().shape({
        transaction_fee_rate: string(),
        transaction_fee_rate_for_first_store_of_customer: string(),
        introduce_people_point: string(),
        introduced_people_point: string(),
        non_membership_gift_rate: string(),
        wallet_point_low_threshold: string(),
        email_notification_wallet_point_low_threshold: string(),
      })
    );
  } else {
    return yupResolver(
      object().shape({
        transaction_fee_rate: string(),
        transaction_fee_rate_for_first_store_of_customer: string(),
        introduce_people_point: string(),
        introduced_people_point: string(),
        non_membership_gift_rate: string(),
        wallet_point_low_threshold: string(),
        email_notification_wallet_point_low_threshold: string(),
      })
    );
  }
};

export const defaultSettingFormState = (choice?: ChoiceType): SettingSchemaProps => {
  if (choice) {
    return {
      introduce_people_point: isDevelopment
        ? chance
            .integer({
              min: 0,
              max: 9,
            })
            .toString()
        : "",
      introduced_people_point: isDevelopment
        ? chance
            .integer({
              min: 0,
              max: 9,
            })
            .toString()
        : "",
      wallet_point_low_threshold: isDevelopment
        ? chance
            .integer({
              min: 0,
              max: 9,
            })
            .toString()
        : "",

      transaction_fee_rate: isDevelopment
        ? chance
            .integer({
              min: 0,
              max: 9,
            })
            .toString()
        : "",
      transaction_fee_rate_for_first_store_of_customer: isDevelopment
        ? chance
            .integer({
              min: 0,
              max: 9,
            })
            .toString()
        : "",
      non_membership_gift_rate: isDevelopment
        ? chance
            .integer({
              min: 0,
              max: 9,
            })
            .toString()
        : "",
      email_notification_wallet_point_low_threshold: isDevelopment ? chance.email() : "",
    };
  } else {
    return {
      introduce_people_point: "",
      introduced_people_point: "",
      wallet_point_low_threshold: "",
      transaction_fee_rate: "",
      transaction_fee_rate_for_first_store_of_customer: "",
      non_membership_gift_rate: "",
      email_notification_wallet_point_low_threshold: "",
    };
  }
};
