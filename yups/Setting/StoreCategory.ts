import { string, object, mixed, array } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ChoiceType } from "interfaces";

import { isDevelopment } from "yups";

import Chance from "chance";

const chance = new Chance();

export interface StoreCategorySchemaProps {
  self?: string;
  name: string;
  icon_for_member: { file: File | string }[];
  icon_for_all: { file: File | string }[];
}

export const storeCategorySchema = (choice?: ChoiceType) => {
  if (choice) {
    return yupResolver(
      object().shape({
        name: string().required(),
        icon_for_member: array(mixed())
          .required()
          .min(1, "Trường này không đuọc bỏ trống"),
        icon_for_all: array(mixed()).required().min(1, "Trường này không đuọc bỏ trống"),
      })
    );
  } else {
    return yupResolver(
      object().shape({
        name: string().required(),
        icon_for_member: array(mixed())
          .required()
          .min(1, "Trường này không đuọc bỏ trống"),
        icon_for_all: array(mixed()).required().min(1, "Trường này không đuọc bỏ trống"),
      })
    );
  }
};

export const defaultStoreCategoryFormState = (
  choice?: ChoiceType
): StoreCategorySchemaProps => {
  if (choice) {
    return {
      name: isDevelopment
        ? chance.name({
            suffix: true,
          })
        : "",
      icon_for_member: [],
      icon_for_all: [],
    };
  } else {
    return {
      name: "",
      icon_for_member: [],
      icon_for_all: [],
    };
  }
};
