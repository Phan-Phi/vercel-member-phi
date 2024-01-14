import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { signIn, signOut } from "next-auth/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import useSWR from "swr";
import get from "lodash/get";
import { cloneDeep } from "lodash";
import { AxiosResponse } from "axios";

import { Box, Stack } from "@mui/material";

import CustomerTable from "./CustomerTable";
import { Loading, SearchField, WrapperTable } from "components";

import {
  RANKS_ITEM,
  CUSTOMERS_ITEM,
  responseSchema,
  MERCHANTS_STORES_ITEM,
  MERCHANTS_STORES_RANKBANDS_ITEM,
} from "interfaces";

import axios from "axios.config";
import { PATHNAME } from "routes";
import { SAFE_OFFSET } from "constant";
import { MERCHANTS_STORES } from "apis";
import { useFetch, useGetHeightForTable, useNotification } from "hooks";
import { handleResponseAxiosError, setFilterValue, transformUrl } from "libs";

const defaultFilterValue = {
  limit: 25,
  offset: 0,
  with_count: true,
  search: "",
};

const DetailStore = () => {
  const router = useRouter();
  const [ref, { height }] = useGetHeightForTable();
  const [filter, setFilter] = useState(defaultFilterValue);

  const isMounted = useMountedState();
  const [merchantRankband, setMerchantRankband] =
    useState<MERCHANTS_STORES_RANKBANDS_ITEM[]>();

  const { enqueueSnackbarWithError } = useNotification();

  const { data: storeData } = useSWR<MERCHANTS_STORES_ITEM>(
    `${MERCHANTS_STORES}${router.query.id}`
  );

  const { data, itemCount, isLoading, changeKey } = useFetch<CUSTOMERS_ITEM>(
    transformUrl(storeData?.customers, filter)
  );

  const { data: merchantStoreRankbandData } = useSWR<
    responseSchema<MERCHANTS_STORES_RANKBANDS_ITEM>
  >(() => {
    if (data == undefined) return;

    return storeData?.rank_bands;
  });

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        const params = cloneDeep(cloneFilter);

        changeKey(transformUrl(storeData?.customers, params));
      };
    },
    [filter]
  );

  useEffect(() => {
    if (merchantStoreRankbandData == undefined) return;

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
        const mutatedMerchantStoreRAnkbandData = data.map((el, idx) => {
          return { ...el, name: rankNameList[idx] };
        });

        if (isMounted()) {
          setMerchantRankband(mutatedMerchantStoreRAnkbandData);
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

  const onGotoHandler = useCallback((props: any) => {
    return (e: React.SyntheticEvent) => {
      e.preventDefault();

      const { row } = props;

      const self = get(row, "original.self");

      const id = self
        .split("/")
        .filter((el: string) => {
          return el !== "";
        })
        .pop();

      window.open(`/${PATHNAME.KHACH_HANG}/${PATHNAME.TAI_KHOAN}/${id}`);
    };
  }, []);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  if (data == undefined || merchantRankband == undefined) {
    return <Loading />;
  }

  return (
    <Stack spacing={3}>
      <SearchField
        onChange={onFilterChangeHandler("search")}
        initSearch={filter.search}
      />

      <WrapperTable>
        <Box ref={ref}>
          <CustomerTable
            data={data ?? []}
            storeData={storeData}
            rankbandData={merchantRankband}
            count={itemCount}
            isLoading={isLoading}
            pagination={pagination}
            onGotoHandler={onGotoHandler}
            onPageChange={onFilterChangeHandler("page")}
            onPageSizeChange={onFilterChangeHandler("pageSize")}
            maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
          />
        </Box>
      </WrapperTable>
    </Stack>
  );
};

export default DetailStore;
