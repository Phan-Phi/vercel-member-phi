import { string, object, array, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ChoiceType } from "interfaces";

import { get } from "lodash";

interface RANK_ITEM {
  band_amount_max: string;
  band_amount_min: string;
  gift_rate_max: string;
  gift_rate_min: string;
  image?: { file: File | string }[];
  name: string;
  self?: string;
}

export interface RankSchemaProps {
  ranks: RANK_ITEM[];
}

export const rankSchema = (choice?: ChoiceType) => {
  if (choice) {
    return yupResolver(
      object().shape({
        ranks: array(
          object().shape({
            band_amount_min: string().required(),
            band_amount_max: string()
              .test({
                test(value, ctx) {
                  const band_amount_min = get(ctx.parent, "band_amount_min");
                  const band_amount_max = get(ctx.parent, "band_amount_max");

                  if (value == undefined) {
                    return ctx.createError({ message: "Trường này là bắt buộc" });
                  }

                  if (parseInt(band_amount_max) <= parseInt(band_amount_min)) {
                    return ctx.createError({
                      message: "Giá trị không nhỏ hoặc bằng Điểm tối thiểu lên hạng",
                    });
                  }
                  return true;
                },
              })
              .required(),

            gift_rate_min: string().required(),
            gift_rate_max: string()
              .test({
                test(value, ctx) {
                  const gift_rate_min = get(ctx.parent, "gift_rate_min");
                  const gift_rate_max = get(ctx.parent, "gift_rate_max");

                  if (value == undefined) {
                    return ctx.createError({ message: "Trường này là bắt buộc" });
                  }

                  if (parseInt(gift_rate_max) <= parseInt(gift_rate_min)) {
                    return ctx.createError({
                      message: "Giá trị không nhỏ hơn hoặc bằng mức ưu đãi tối thiểu",
                    });
                  }

                  return true;
                },
              })
              .required(),
            name: string().required(),
            image: array(mixed()).min(1, "Trường này không được bỏ trống!"),
          })
        ),
      })
    );
  } else {
    return yupResolver(
      object().shape({
        ranks: array(
          object().shape({
            band_amount_min: string().required(),
            band_amount_max: string()
              .test({
                test(value, ctx) {
                  const band_amount_min = get(ctx.parent, "band_amount_min");
                  const band_amount_max = get(ctx.parent, "band_amount_max");

                  if (value == undefined) {
                    return ctx.createError({ message: "Trường này là bắt buộc" });
                  }

                  if (parseInt(band_amount_max) <= parseInt(band_amount_min)) {
                    return ctx.createError({
                      message: "Giá trị không nhỏ hoặc bằng Điểm tối thiểu lên hạng",
                    });
                  }
                  return true;
                },
              })
              .required(),
            gift_rate_min: string().required(),
            gift_rate_max: string()
              .test({
                test(value, ctx) {
                  const gift_rate_min = get(ctx.parent, "gift_rate_min");
                  const gift_rate_max = get(ctx.parent, "gift_rate_max");

                  if (value == undefined) {
                    return ctx.createError({ message: "Trường này là bắt buộc" });
                  }
                  if (parseInt(gift_rate_max) <= parseInt(gift_rate_min)) {
                    return ctx.createError({
                      message: "Giá trị không nhỏ hoặc bằng Mức ưu đãi tối thiểu",
                    });
                  }

                  return true;
                },
              })
              .required(),

            name: string().required(),
            image: array(mixed()).min(1, "Trường này không được bỏ trống!"),
          })
        ),
      })
    );
  }
};

export const defaultRankFormState = (choice?: ChoiceType): RankSchemaProps => {
  if (choice) {
    return {
      ranks: [],
    };
  } else {
    return {
      ranks: [],
    };
  }
};
