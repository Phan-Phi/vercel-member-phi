import { string, object, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ChoiceType } from "interfaces";

import { isDevelopment } from "yups";

import Chance from "chance";

import { ChoiceItem } from "interfaces";

const chance = new Chance();

export interface AdminAddressSchemaProps {
  user: string;
  line: string;
  ward: ChoiceItem | null;
  district: ChoiceItem | null;
  province: ChoiceItem | null;
}

export const adminAddressSchema = (choice?: ChoiceType) => {
  if (choice) {
    return yupResolver(
      object().shape({
        user: string(),
        line: string().required(),
        ward: mixed().required(),
        district: mixed().required(),
        province: mixed().required(),
      })
    );
  } else {
    return yupResolver(
      object().shape({
        user: string(),
        line: string().required(),
        ward: mixed().required(),
        district: mixed().required(),
        province: mixed().required(),
      })
    );
  }
};

export const defaultAdminAddressFormState = (
  choice?: ChoiceType
): AdminAddressSchemaProps => {
  if (choice) {
    return {
      user: "",
      line: isDevelopment ? chance.address() : "",
      ward: isDevelopment ? ["W_27211", "Phường 05"] : null,
      district: isDevelopment ? ["D_772", "Quận 11"] : null,
      province: isDevelopment ? ["P_79", "Thành phố Hồ Chí Minh"] : null,
    };
  } else {
    return {
      user: "",
      line: isDevelopment ? chance.address() : "",
      ward: isDevelopment ? ["W_27211", "Phường 05"] : null,
      district: isDevelopment ? ["D_772", "Quận 11"] : null,
      province: isDevelopment ? ["P_79", "Thành phố Hồ Chí Minh"] : null,
    };
  }
};
