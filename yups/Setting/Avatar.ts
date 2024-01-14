import { object, mixed, array } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ChoiceType } from "interfaces";

export interface AvatarSchemaProps {
  avatars: { file: File | string }[];
}

export const avatarSchema = (choice?: ChoiceType) => {
  if (choice) {
    return yupResolver(
      object().shape({
        avatars: array(mixed()).required().min(1, "Trường này không được bỏ trống!"),
      })
    );
  } else {
    return yupResolver(
      object().shape({
        avatars: array(mixed()).required().min(1, "Trường này không được bỏ trống!"),
      })
    );
  }
};

export const defaultAvatarFormState = (choice?: ChoiceType): AvatarSchemaProps => {
  if (choice) {
    return {
      avatars: [],
    };
  } else {
    return {
      avatars: [],
    };
  }
};
