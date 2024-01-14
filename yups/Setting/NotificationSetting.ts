import { string, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ChoiceType } from "interfaces";

import { validatePhoneNumber } from "yups/utils";

export interface NotificationSettingSchemaProps {
  store_notification_period: string;
  store_notification_quantity_in_period: string;
  hotline: string;
  contact_email: string;
  below_threshold_notification_title: string;
  below_threshold_notification_template: string;
  increase_point_notification_title: string;
  increase_point_notification_template: string;
  decrease_point_notification_title: string;
  decrease_point_notification_template: string;
  email_sender: string;
  email_sender_name: string;
  admin_create_password_email_subject: string;
  admin_create_password_email_template: string;
  admin_reset_password_email_subject: string;
  admin_reset_password_email_template: string;
  cashier_create_password_email_subject: string;
  cashier_create_password_email_template: string;
  merchant_create_password_email_subject: string;
  merchant_create_password_email_template: string;
  merchant_or_cashier_reset_password_email_subject: string;
  merchant_or_cashier_reset_password_email_template: string;
  merchant_wallet_below_threshold_email_subject: string;
  merchant_wallet_below_threshold_email_template: string;
  customer_verify_email_subject: string;
  customer_verify_email_template: string;
  customer_reset_password_email_subject: string;
  customer_reset_password_email_template: string;
}

export const notificationSettingSchema = (choice?: ChoiceType) => {
  return yupResolver(
    object().shape({
      store_notification_period: string().required(),
      store_notification_quantity_in_period: string().required(),
      hotline: validatePhoneNumber().required(),
      contact_email: string().email().required(),
      below_threshold_notification_title: string(),
      below_threshold_notification_template: string(),
      increase_point_notification_title: string(),
      increase_point_notification_template: string(),
      decrease_point_notification_title: string(),
      decrease_point_notification_template: string(),
      email_sender: string(),
      email_sender_name: string(),
      admin_create_password_email_subject: string(),
      admin_create_password_email_template: string(),
      admin_reset_password_email_subject: string(),
      admin_reset_password_email_template: string(),
      cashier_create_password_email_subject: string(),
      cashier_create_password_email_template: string(),
      merchant_create_password_email_subject: string(),
      merchant_create_password_email_template: string(),
      merchant_or_cashier_reset_password_email_subject: string(),
      merchant_or_cashier_reset_password_email_template: string(),
      merchant_wallet_below_threshold_email_subject: string(),
      merchant_wallet_below_threshold_email_template: string(),
      customer_verify_email_subject: string(),
      customer_verify_email_template: string(),
      customer_reset_password_email_subject: string(),
      customer_reset_password_email_template: string(),
    })
  );
};

export const defaultNotificationSettingFormState = (
  choice?: ChoiceType
): NotificationSettingSchemaProps => {
  return {
    store_notification_period: "",
    store_notification_quantity_in_period: "",
    hotline: "",
    contact_email: "",
    below_threshold_notification_title: "",
    below_threshold_notification_template: "",
    increase_point_notification_title: "",
    increase_point_notification_template: "",
    decrease_point_notification_title: "",
    decrease_point_notification_template: "",
    email_sender: "",
    email_sender_name: "",
    admin_create_password_email_subject: "",
    admin_create_password_email_template: "",
    admin_reset_password_email_subject: "",
    admin_reset_password_email_template: "",
    cashier_create_password_email_subject: "",
    cashier_create_password_email_template: "",
    merchant_create_password_email_subject: "",
    merchant_create_password_email_template: "",
    merchant_or_cashier_reset_password_email_subject: "",
    merchant_or_cashier_reset_password_email_template: "",
    merchant_wallet_below_threshold_email_subject: "",
    merchant_wallet_below_threshold_email_template: "",
    customer_verify_email_subject: "",
    customer_verify_email_template: "",
    customer_reset_password_email_subject: "",
    customer_reset_password_email_template: "",
  };
};
