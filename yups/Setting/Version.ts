import { isDevelopment } from "yups";

import Chance from "chance";
import { ChoiceType } from "interfaces";
import { yupResolver } from "@hookform/resolvers/yup";
import { bool, object, string } from "yup";

const chance = new Chance();

export type VERSION_ITEM = {
  items: any;
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
};

export interface VersionSchemaProps {
  self?: string;
  appName: string;
  appPlatform: string;
  name: string;
  deprecated: boolean;
}

export const customerSchema = (choice?: ChoiceType) => {
  if (choice) {
    return yupResolver(
      object().shape({
        appName: string().email().required(),
        appPlatform: string().email().required(),
        name: string().email().required(),
        deprecated: bool(),
      })
    );
  } else {
    return yupResolver(
      object().shape({
        appName: string().email().required(),
        appPlatform: string().email().required(),
        name: string().email().required(),
        deprecated: bool(),
      })
    );
  }
};

export const defaultVersionFormState = (choice?: ChoiceType): VersionSchemaProps => {
  if (choice) {
    return {
      appName: isDevelopment
        ? chance.name({
            suffix: true,
          })
        : "",
      appPlatform: isDevelopment
        ? chance.name({
            suffix: true,
          })
        : "",
      name: isDevelopment
        ? chance.name({
            suffix: true,
          })
        : "",
      deprecated: true,
    };
  } else {
    return {
      appName: "",
      appPlatform: "",
      name: "",
      deprecated: true,
    };
  }
};
