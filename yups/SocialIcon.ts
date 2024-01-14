import { string, object, array, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ChoiceType } from "interfaces";

export interface SocialIconProps {
  self?: string;
  link: string;
  image: { file: File | string }[];
}

export interface SocialIconSchemaProps {
  socialItemList: SocialIconProps[];
}

export const socialIconSchema = (choice?: ChoiceType) => {
  return yupResolver(
    object().shape({
      socialItemList: array(
        object().shape({
          link: string().required().url(),
          image: array(mixed()).required().min(1, "Trường này không được bỏ trống"),
        })
      ),
    })
  );
};

export const defaultSocialIconFormState = (
  choice?: ChoiceType
): SocialIconSchemaProps => {
  return {
    socialItemList: [],
  };
};
