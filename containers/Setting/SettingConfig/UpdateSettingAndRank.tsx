import useSWR from "swr";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import React, { useCallback, useEffect, useState } from "react";

import {
  get,
  set,
  pick,
  omit,
  unset,
  isEmpty,
  isEqual,
  cloneDeep,
  differenceWith,
} from "lodash";

import { Button, Container, Stack } from "@mui/material";

import axios from "axios.config";
import { BUTTON } from "constant";
import { PATHNAME } from "routes";
import { RANKS, SETTINGS } from "apis";
import { useNotification, useSetting } from "hooks";
import { transformJSONToFormData, transformUrl } from "libs";
import { RANKS_ITEM, responseSchema, SETTINGS_ITEM } from "interfaces";

import {
  rankSchema,
  settingSchema,
  RankSchemaProps,
  SettingSchemaProps,
  defaultSettingFormState,
} from "yups";

import { LoadingButton, Loading } from "components";

import RankForm from "./RankForm";
import SettingForm from "./SettingForm";

export default function ConfigPointsUpdate() {
  const router = useRouter();
  const setting = useSetting();

  const [defaultRankValues, setDefaultRankValues] = useState<RankSchemaProps>();
  const [defaultSettingValues, setDefaultSettingValues] = useState<SettingSchemaProps>();

  const { mutate: settingMutate } = useSWR(SETTINGS);

  const { data: resRankData, mutate: rankMutate } = useSWR<responseSchema<RANKS_ITEM>>(
    transformUrl(RANKS, {
      use_cache: false,
    })
  );

  const setDefaultValuesHandler = useCallback((data: SETTINGS_ITEM) => {
    if (data == undefined) return;

    const body = {} as SettingSchemaProps;

    const keyList = Object.keys(defaultSettingFormState());

    keyList.forEach((key) => {
      let tempValue = get(data, key);

      if (
        [
          "transaction_fee_rate",
          "transaction_fee_rate_for_first_store_of_customer",
          "non_membership_gift_rate",
        ].includes(key)
      ) {
        tempValue = tempValue * 100;
      }

      set(body, key, tempValue);
    });

    setDefaultSettingValues(body);
  }, []);

  const setDefaultRankValuesHandler = useCallback((data: RANKS_ITEM[]) => {
    const transformedData = data.map((el) => {
      return {
        ...el,
        band_amount_min: el.band_amount_min.toString(),
        band_amount_max: el.band_amount_max.toString(),
        gift_rate_min: (el.gift_rate_min * 100).toFixed(),
        gift_rate_max: (el.gift_rate_max * 100).toFixed(),
        image: [{ file: el.image }],
      };
    });

    setDefaultRankValues({
      ranks: transformedData,
    });
  }, []);

  useEffect(() => {
    if (setting == undefined) return;

    setDefaultValuesHandler(setting);
  }, [setting, setDefaultValuesHandler]);

  useEffect(() => {
    if (resRankData == undefined) return;

    setDefaultRankValuesHandler(get(resRankData, "results"));
  }, [resRankData, setDefaultRankValuesHandler]);

  const onSuccessHandler = useCallback(async () => {
    await Promise.all([settingMutate(), rankMutate()]);
    router.back();
  }, []);

  if (defaultSettingValues == undefined || defaultRankValues == undefined) {
    return <Loading />;
  }

  return (
    <RootComponent {...{ defaultRankValues, defaultSettingValues, onSuccessHandler }} />
  );
}

interface RootComponentProps {
  defaultSettingValues: SettingSchemaProps;
  defaultRankValues: RankSchemaProps;
  onSuccessHandler: () => Promise<void>;
}

const RootComponent = (props: RootComponentProps) => {
  const { defaultSettingValues, defaultRankValues, onSuccessHandler } = props;

  const router = useRouter();
  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const {
    control: settingControl,
    handleSubmit: settingHandleSubmit,
    formState: { dirtyFields: settingDirtyFields },
  } = useForm({
    resolver: settingSchema(),
    defaultValues: defaultSettingValues,
  });

  const {
    control: rankControl,
    setError: rankSetError,
    clearErrors: rankClearErrors,
    handleSubmit: rankHandleSubmit,
  } = useForm({
    resolver: rankSchema(),
    defaultValues: defaultRankValues,
  });

  const onSubmit = useCallback(
    async ({
      rankData,
      settingData,
      settingDirtyFields,
      defaultRankData,
    }: {
      settingData: SettingSchemaProps;
      rankData: RankSchemaProps;
      settingDirtyFields: object;
      defaultRankData: RankSchemaProps;
    }) => {
      const transformedSettingData = cloneDeep(settingData);

      [
        "non_membership_gift_rate",
        "transaction_fee_rate",
        "transaction_fee_rate_for_first_store_of_customer",
      ].forEach((key) => {
        const tempValue = get(transformedSettingData, key);
        set(transformedSettingData, key, parseFloat(tempValue) / 100);
      });

      setLoading(true);

      const transformedRankData = rankData.ranks.map((el) => {
        const image = get(el, "image[0].file");

        return {
          ...el,
          image,
          gift_rate_min: parseFloat(el.gift_rate_min) / 100,
          gift_rate_max: parseFloat(el.gift_rate_max) / 100,
        };
      });
      const transformedOriginalRankData = defaultRankData.ranks.map((el) => {
        const image = get(el, "image[0].file");

        return { ...el, image };
      });

      const newRankList = differenceWith(
        transformedRankData,
        transformedOriginalRankData,
        (el1, el2) => {
          const compareList = ["self"];

          const list1 = pick(el1, compareList);
          const list2 = pick(el2, compareList);

          return isEqual(list1, list2);
        }
      );

      const removeRankList = differenceWith(
        transformedOriginalRankData,
        transformedRankData,
        (el1, el2) => {
          const compareList = ["self"];

          const list1 = pick(el1, compareList);
          const list2 = pick(el2, compareList);

          return isEqual(list1, list2);
        }
      );

      const updateRankList: RankSchemaProps["ranks"] = [];

      transformedRankData.forEach((el) => {
        if (el.self) {
          const originalData = transformedOriginalRankData.find((el2) => {
            return el2.self === el.self;
          });

          if (originalData && !isEqual(el, originalData)) {
            updateRankList.push(el as any);
          }
        }
      });

      try {
        const resList: any[] = [];

        if (!isEmpty(settingDirtyFields)) {
          const body = pick(transformedSettingData, Object.keys(settingDirtyFields));

          await axios.patch(SETTINGS, body);
        }

        if (!isEmpty(removeRankList)) {
          removeRankList.forEach((el) => {
            if (el.self) {
              resList.push(axios.delete(el.self));
            }
          });
        }

        if (!isEmpty(newRankList)) {
          newRankList.forEach((el) => {
            const formData = transformJSONToFormData(el);

            resList.push(axios.post(RANKS, formData));
          });
        }

        if (!isEmpty(updateRankList)) {
          updateRankList.reduce(async (promise, el) => {
            return promise.then(() => {
              return new Promise(async (resolve) => {
                const self = el.self;

                if (self) {
                  const body = omit(el, "self");

                  const image = get(el, "image");

                  if (typeof image === "string") {
                    unset(body, "image");
                  }

                  const formData = transformJSONToFormData(body);

                  await axios.patch(self, formData);

                  resolve(null);
                }
              });
            });
          }, Promise.resolve(null));
        }

        await Promise.all(resList);

        enqueueSnackbarWithSuccess("Cập nhật thiết lập thành công");
        onSuccessHandler();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    []
  );

  const onGoBackHandler = useCallback(() => {
    router.push(`/${PATHNAME.CAI_DAT}/${PATHNAME.CAU_HINH}`);
  }, []);

  return (
    <Container>
      <Stack spacing={3}>
        <RankForm
          {...{
            control: rankControl,
            setError: rankSetError,
            clearErrors: rankClearErrors,
          }}
        />

        <SettingForm {...{ control: settingControl }} />

        <Stack flexDirection="row" columnGap={2} justifyContent="center">
          <Button variant="outlined" disabled={loading} onClick={onGoBackHandler}>
            {BUTTON.BACK}
          </Button>

          <LoadingButton
            onClick={settingHandleSubmit((settingData) => {
              rankHandleSubmit((rankData) => {
                onSubmit({
                  rankData,
                  settingData,
                  settingDirtyFields,
                  defaultRankData: defaultRankValues,
                });
              })();
            })}
            loading={loading}
          >
            {BUTTON.UPDATE}
          </LoadingButton>
        </Stack>
      </Stack>
    </Container>
  );
};
