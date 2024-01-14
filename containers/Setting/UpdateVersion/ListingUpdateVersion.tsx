import queryString from "query-string";
import { useRouter } from "next/router";
import { cloneDeep, get, set, omit } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { Box, Button, Container, Grid, Stack } from "@mui/material";
import { VERSION } from "apis";
import { BoxWithShadow, LoadingButton, WrapperTable } from "components";
import { BUTTON, SAFE_OFFSET } from "constant";

import { Sticky } from "hocs";
import { useFetch, useGetHeightForTable, usePermission } from "hooks";
import { setFilterValue, transformDate, transformUrl } from "libs";
import { PATHNAME } from "routes";
import VersionTable from "./VersionTable";
import FilterVersion from "./FilterVersion";
import { VERSION_ITEM } from "yups/Setting/Version";

export type VersionFilterType = {
  page2: number;
  perPage: number;
  deprecated: string;
  appPlatform: string;
  sort: string;
};

const defaultFilterValue: VersionFilterType = {
  perPage: 25,
  page2: 1,
  deprecated: "",
  appPlatform: "",
  sort: "-releasedDate",
};

export default function UpdateVersion() {
  const router = useRouter();
  const [ref, { height }] = useGetHeightForTable();
  const [filter, setFilter] = useState(defaultFilterValue);

  const { resData, isLoading, itemCount, changeKey } = useFetch<VERSION_ITEM>(
    transformUrl(VERSION, filter)
  );

  const onGotoHandler = useCallback(() => {
    router.push(`${router.pathname}/${PATHNAME.TAO_MOI}`);
  }, [router]);

  const onViewHandler = useCallback((props: any) => {
    const { row } = props;

    const self = get(row, "original.id");
    const id = self
      .split("/")
      .filter((el: string) => {
        return el !== "";
      })
      .pop();

    const { url } = queryString.parseUrl(router.asPath);

    router.push(`${url}/${id}`);
  }, []);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);
        cloneFilter = setFilterValue(cloneFilter, key, value);

        if (key === "deprecated") {
          set(cloneFilter, key, value);
        }
        if (key === "appPlatform") {
          set(cloneFilter, key, value);
        }

        setFilter(cloneFilter);

        const params = cloneDeep(cloneFilter);
        set(params, "deprecated", get(params, "deprecated"));
        set(params, "appPlatform", get(params, "appPlatform"));

        let appPlatform =
          params.appPlatform === "" ? `` : `appPlatform="${params.appPlatform}"`;
        let deprecated =
          params.deprecated === "" ? `` : `deprecated=${params.deprecated}`;

        changeKey(
          transformUrl(VERSION, {
            filter:
              deprecated === "" && appPlatform === ""
                ? null
                : `(${deprecated}${
                    deprecated === "" || appPlatform === "" ? `` : "&&"
                  }${appPlatform})`,

            perPage: params.perPage,
            page: params.page2,
            sort: "-releasedDate",
          })
        );
      };
    },
    [filter]
  );

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(transformUrl(VERSION, defaultFilterValue));
  }, [filter]);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page2 - 1,
      pageSize: filter.perPage,
    };
  }, [filter]);

  return (
    <Container>
      <Grid container>
        <Grid item xs={3}>
          <FilterVersion
            filter={filter}
            resetFilter={resetFilterHandler}
            onUpdateChange={onFilterChangeHandler("deprecated")}
            onAppChange={onFilterChangeHandler("appPlatform")}
          />
        </Grid>
        <Grid item xs={9}>
          <Sticky>
            <Stack spacing={3}>
              <WrapperTable>
                <Box ref={ref}>
                  <VersionTable
                    totalItem={resData ? resData.totalItems : 0}
                    data={resData ? resData.items : []}
                    count={itemCount}
                    isLoading={isLoading}
                    pagination={pagination}
                    onPageChange={onFilterChangeHandler("page2")}
                    onPageSizeChange={onFilterChangeHandler("perPage")}
                    maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
                    onViewHandler={onViewHandler}
                  />
                </Box>
              </WrapperTable>
            </Stack>
          </Sticky>
        </Grid>
      </Grid>
    </Container>
  );
}
