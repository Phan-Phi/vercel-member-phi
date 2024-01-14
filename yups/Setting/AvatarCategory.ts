import { string, object, mixed, array } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ChoiceType } from "interfaces";

import { isDevelopment } from "yups";

import Chance from "chance";

const chance = new Chance();

export interface AvatarCategorySchemaProps {
  self?: string;
  name: string;
  image: { file: File | string }[];
}

export const avatarCategorySchema = (choice?: ChoiceType) => {
  if (choice) {
    return yupResolver(
      object().shape({
        name: string().required(),
        image: array(mixed()).required().min(1, "Trường này không được bỏ trống!"),
      })
    );
  } else {
    return yupResolver(
      object().shape({
        name: string().required(),
        image: array(mixed()).required().min(1, "Trường này không được bỏ trống!"),
      })
    );
  }
};

export const defaultAvatarCategoryFormState = (
  choice?: ChoiceType
): AvatarCategorySchemaProps => {
  if (choice) {
    return {
      name: isDevelopment
        ? chance.name({
            suffix: true,
          })
        : "",
      image: [],
    };
  } else {
    return {
      name: "",
      image: [],
    };
  }
};
