import { string, object, array, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ChoiceType } from "interfaces";

import { isDevelopment } from "yups";

import Chance from "chance";
import { get } from "lodash";

const chance = new Chance();

export interface RankProps {
  rank: {
    band_amount_max: string;
    band_amount_min: string;
    gift_rate_max: string;
    gift_rate_min: string;
    image?: { file: File | string }[];
    name: string;
    self?: string;
  }[];
}

export const rankSchema = (choice?: ChoiceType) => {
  if (choice) {
    return yupResolver(
      object().shape({
        rank: array(
          object().shape({
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
                      message: "Giá trị không nhỏ hơn Điểm tối thiểu lên hạng",
                    });
                  }
                  return true;
                },
              })
              .required(),
            band_amount_min: string().required(),
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
                      message: "Giá trị không nhỏ hơn Mức ưu đãi tối thiểu",
                    });
                  }

                  return true;
                },
              })
              .required(),
            gift_rate_min: string()
              .test({
                test(value, ctx) {
                  if (value == undefined) {
                    return ctx.createError({ message: "Trường này là bắt buộc" });
                  }
                  return true;
                },
              })
              .required(),
            name: string().required(),
            image: array(mixed()),
          })
        ),
      })
    );
  } else {
    return yupResolver(
      object().shape({
        rank: array(
          object().shape({
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
                      message: "Giá trị không nhỏ hơn Điểm tối thiểu lên hạng",
                    });
                  }
                  return true;
                },
              })
              .required(),
            band_amount_min: string().required(),
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
                      message: "Giá trị không nhỏ hơn Mức ưu đãi tối thiểu",
                    });
                  }

                  return true;
                },
              })
              .required(),
            gift_rate_min: string()
              .test({
                test(value, ctx) {
                  if (value == undefined) {
                    return ctx.createError({ message: "Trường này là bắt buộc" });
                  }
                  return true;
                },
              })
              .required(),
            name: string().required(),
            image: array(mixed()),
          })
        ),
      })
    );
  }
};

export const defaultRankFormState = (choice?: ChoiceType): RankProps => {
  if (choice) {
    return {
      rank: [
        {
          band_amount_max: isDevelopment
            ? chance
                .integer({
                  min: 0,
                  max: 99,
                })
                .toString()
            : "",
          band_amount_min: isDevelopment
            ? chance
                .integer({
                  min: 0,
                  max: 99,
                })
                .toString()
            : "",
          gift_rate_max: isDevelopment
            ? chance
                .integer({
                  min: 0,
                  max: 99,
                })
                .toString()
            : "",
          gift_rate_min: isDevelopment
            ? chance
                .integer({
                  min: 0,
                  max: 99,
                })
                .toString()
            : "",
          name: isDevelopment
            ? chance.name({
                suffix: true,
              })
            : "",
        },
      ],
    };
  } else {
    return {
      rank: [],
      // image: [],
      // band_amount_max: isDevelopment
      //   ? chance
      //       .integer({
      //         min: 0,
      //         max: 99,
      //       })
      //       .toString()
      //   : "",
      // band_amount_min: isDevelopment
      //   ? chance
      //       .integer({
      //         min: 0,
      //         max: 99,
      //       })
      //       .toString()
      //   : "",
      // gift_rate_max: isDevelopment
      //   ? chance
      //       .integer({
      //         min: 0,
      //         max: 99,
      //       })
      //       .toString()
      //   : "",
      // gift_rate_min: isDevelopment
      //   ? chance
      //       .integer({
      //         min: 0,
      //         max: 99,
      //       })
      //       .toString()
      //   : "",
      // name: isDevelopment
      //   ? chance.name({
      //       suffix: true,
      //     })
      //   : "",
    };
  }
};
