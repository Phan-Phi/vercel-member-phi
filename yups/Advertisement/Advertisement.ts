import { string, object, bool, array, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ChoiceType } from "interfaces";

import { getChoiceValue } from "libs";

import { isDevelopment } from "yups";

import Chance from "chance";

const chance = new Chance();

export interface AdvertisementSchemaProps {
  is_popup: boolean;
  sort_order: string;
  body: string;
  app_type: string;
  position: string[];
  banner: { file: File | string }[];
  title: string;
  short_description: string;
  self?: string;
}

export const advertisementSchema = (choice?: ChoiceType) => {
  if (choice) {
    const { app_type, position } = choice;
    const filteredAppType = app_type.filter((el) => {
      return el[0] !== "Admin";
    });
    return yupResolver(
      object().shape({
        is_popup: bool(),
        sort_order: string().required(),
        app_type: string().oneOf(getChoiceValue(filteredAppType)),
        // position: string().oneOf(getChoiceValue(position)),
        position: array(string().oneOf(getChoiceValue(position))),
        banner: array(mixed()).required().min(1, "Trường này không đuọc bỏ trống"),
        body: string().required(),
        short_description: string().required(),
        title: string().required(),
      })
    );
  } else {
    return yupResolver(
      object().shape({
        is_popup: bool(),
        sort_order: string().required(),
        app_type: string(),
        // position: string(),
        position: array(string()),
        banner: array(mixed()).required().min(1, "trường này không được bỏ trống"),
        body: string().required(),
        short_description: string().required(),
        title: string().required(),
      })
    );
  }
};

export const defaultAdvertisementFormState = (
  choice?: ChoiceType
): AdvertisementSchemaProps => {
  if (choice) {
    const { app_type, position } = choice;

    const filteredAppType = app_type.filter((el) => {
      return el[0] !== "Admin";
    });
    const filteredAppTypeValue = getChoiceValue(filteredAppType);
    const filteredPositionValue = getChoiceValue(position);

    return {
      title: isDevelopment
        ? chance.name({
            suffix: true,
          })
        : "",
      is_popup: true,
      banner: [],
      app_type: filteredAppTypeValue[0],
      position: [filteredPositionValue[0]],
      sort_order: isDevelopment
        ? chance
            .integer({
              min: 0,
              max: 99,
            })
            .toString()
        : "",
      body: isDevelopment
        ? chance.word({
            length: 50,
          })
        : "",

      short_description: isDevelopment
        ? chance.word({
            length: 50,
          })
        : "",
    };
  } else {
    return {
      title: isDevelopment
        ? chance.name({
            suffix: true,
          })
        : "",
      is_popup: true,
      banner: [],
      app_type: "",
      position: [],
      sort_order: "",
      body: "",
      short_description: "",
    };
  }
};
