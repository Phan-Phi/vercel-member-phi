import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { signIn, signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";

import useSWR from "swr";
import { AxiosResponse } from "axios";
import { Divider, Typography, Stack, Box } from "@mui/material";

import axios from "axios.config";
import { useNotification } from "hooks";
import { MERCHANTS_STORES } from "apis";
import { Loading, BoxWithShadow } from "components";
import { handleResponseAxiosError, transformUrl } from "libs";

import {
  RANKS_ITEM,
  responseSchema,
  MERCHANTS_STORES_ITEM,
  MERCHANTS_STORES_RANKBANDS_ITEM,
} from "interfaces";

const DetailStore = () => {
  const router = useRouter();
  const isMounted = useMountedState();
  const { enqueueSnackbarWithError } = useNotification();

  const [data, setData] = useState<any[][]>();

  const { data: merchantStoreData } = useSWR<MERCHANTS_STORES_ITEM>(
    `${MERCHANTS_STORES}${router.query.id}`
  );

  const { data: merchantStoreRankbandData } = useSWR<
    responseSchema<MERCHANTS_STORES_RANKBANDS_ITEM>
  >(() => {
    if (merchantStoreData) {
      return transformUrl(merchantStoreData.rank_bands, {
        limit: 100,
      });
    }
  });

  useEffect(() => {
    if (merchantStoreRankbandData == undefined) {
      return;
    }

    const controller = new AbortController();

    const data = merchantStoreRankbandData.results;

    const rankList = data.map((el) => {
      return el.rank;
    });

    Promise.all<AxiosResponse<RANKS_ITEM>>(
      rankList.map((el) =>
        axios.get(el, {
          signal: controller.signal,
        })
      )
    )
      .then((resData) => {
        return resData.map((el) => {
          const { data } = el;

          return data.name;
        });
      })
      .then((rankNameList) => {
        const headerList = [
          "Hạng",
          "Mức Ưu Đãi",
          "Số Điểm Để Lên Hạng",
          "Mô Tả Hạng Thành Viên",
        ];

        const transformedData = headerList.map((el, idx) => {
          if (idx === 0) {
            return [el, ...rankNameList];
          }

          if (idx === 1) {
            return [el, ...data.map((el) => `${(el.gift_rate * 100).toFixed(0)}%`)];
          }

          if (idx === 2) {
            return [el, ...data.map((el) => el.band_amount)];
          }

          if (idx === 3) {
            return [el, ...data.map((el) => el.description || "-")];
          }

          return [];
        });

        if (isMounted()) {
          setData(transformedData);
        }
      })
      .catch((err) => {
        enqueueSnackbarWithError(err);
        handleResponseAxiosError(err, signIn, signOut);
      });

    return () => {
      controller.abort();
    };
  }, [merchantStoreRankbandData]);

  if (data == undefined) {
    return <Loading />;
  }

  return (
    <BoxWithShadow>
      <Stack spacing={2.5} divider={<Divider />}>
        {data.map((subData, outerIdx) => {
          return (
            <Box
              key={outerIdx}
              display="grid"
              gridTemplateColumns={"repeat(5, 1fr)"}
              columnGap={3}
            >
              {subData.map((el, idx) => {
                return (
                  <Box key={idx}>
                    <Typography
                      fontWeight={outerIdx === 0 ? 500 : idx === 0 ? 500 : undefined}
                    >
                      {el}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Stack>
    </BoxWithShadow>
  );
};

export default DetailStore;
