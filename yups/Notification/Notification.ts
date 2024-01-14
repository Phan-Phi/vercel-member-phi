import { string, object, array, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ChoiceType } from "interfaces";

import { getChoiceValue } from "libs";

import { isDevelopment } from "yups";

import Chance from "chance";

const chance = new Chance();

export interface NotificationSchemaProps {
  app_type: string;
  body: string;
  sub_body: string;
  file: { file: File | string }[];
  image: { file: File | string }[];
  title: string;
  self?: string;
}

export const notificationSchema = (choice?: ChoiceType) => {
  if (choice) {
    const { app_type } = choice;

    const filteredAppType = app_type.filter((el, idx) => {
      return el[0] !== "Admin";
    });

    return yupResolver(
      object().shape({
        app_type: string().required().oneOf(getChoiceValue(filteredAppType)),
        body: string().required(),
        sub_body: string().required(),
        title: string().required(),
        image: array(mixed()),
        file: array(mixed()).required().min(1, "Trường này không được bỏ trống"),
      })
    );
  } else {
    return yupResolver(
      object().shape({
        app_type: string().required(),
        body: string().required(),
        sub_body: string().required(),
        title: string().required(),
        image: array(mixed()),
        file: array(mixed()).required().min(1, "Trường này không được bỏ trống"),
      })
    );
  }
};

export const defaultNotificationFormState = (
  choice?: ChoiceType
): NotificationSchemaProps => {
  if (choice) {
    const { app_type } = choice;

    const filteredAppType = app_type.filter((el, idx) => {
      return el[0] !== "Admin";
    });

    return {
      title: isDevelopment
        ? chance.name({
            suffix: true,
          })
        : "",
      app_type: getChoiceValue(filteredAppType)[0],
      body: isDevelopment
        ? chance.word({
            length: 50,
          })
        : "",
      sub_body: isDevelopment
        ? chance.word({
            length: 50,
          })
        : "",

      image: [],
      file: [],
    };
  } else {
    return {
      file: [],
      title: isDevelopment
        ? chance.name({
            suffix: true,
          })
        : "",
      app_type: "",
      image: [],
      body: "",
      sub_body: "",
    };
  }
};
