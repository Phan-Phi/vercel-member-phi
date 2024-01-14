import { string, object, bool, array, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ChoiceType } from "interfaces";

import { getChoiceValue } from "libs";

import { isDevelopment } from "yups";

import Chance from "chance";

const chance = new Chance();

export interface PointNoteSchemaSchemaProps {
  note: string;
  owner: string;
  owner_as_customer: string;
  flow_type: string;
  point_amount: string;
  type: string;
}

export const pointNoteSchema = (choice?: ChoiceType) => {
  if (choice) {
    const { point_note_flow_types } = choice;

    const filteredAppType = point_note_flow_types.filter((el) => {
      return el[0] !== "Point_To_Cash";
    });

    return yupResolver(
      object().shape({
        note: string().required(),
        owner: mixed(),
        point_amount: string().required(),
        owner_as_customer: mixed(),
        flow_type: string().oneOf(getChoiceValue(filteredAppType)),
        type: mixed(),
      })
    );
  } else {
    return yupResolver(
      object().shape({
        flow_type: string(),
        note: string().required(),
        owner: mixed(),
        point_amount: string().required(),
        owner_as_customer: mixed(),
        type: mixed(),
      })
    );
  }
};

export const defaultPointNoteFormState = (
  choice?: ChoiceType
): PointNoteSchemaSchemaProps => {
  if (choice) {
    const { point_note_flow_types } = choice;

    const filteredAppType = point_note_flow_types.filter((el) => {
      return el[0] !== "Point_To_Cash";
    });
    const filteredAppTypeValue = getChoiceValue(filteredAppType);

    return {
      flow_type: filteredAppTypeValue[0],
      owner: isDevelopment
        ? chance.name({
            suffix: true,
          })
        : "",
      type: isDevelopment
        ? chance.name({
            suffix: true,
          })
        : "",
      owner_as_customer: isDevelopment
        ? chance.name({
            suffix: true,
          })
        : "",
      note: isDevelopment
        ? chance.word({
            length: 50,
          })
        : "",

      point_amount: isDevelopment
        ? chance
            .integer({
              min: 0,
              max: 99,
            })
            .toString()
        : "",
    };
  } else {
    return {
      flow_type: "",
      owner: isDevelopment
        ? chance.name({
            suffix: true,
          })
        : "",
      owner_as_customer: isDevelopment
        ? chance.name({
            suffix: true,
          })
        : "",
      note: "",
      type: "",
      point_amount: "",
    };
  }
};
