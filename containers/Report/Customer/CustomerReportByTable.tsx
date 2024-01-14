import { Range } from "react-date-range";
import React, { Fragment, useCallback, useMemo, useState } from "react";

import useSWR from "swr";
import axios from "axios.config";
import { cloneDeep, get, omit, set } from "lodash";
import { formatISO, startOfMonth, endOfMonth } from "date-fns";
import { Box, Grid, SelectChangeEvent } from "@mui/material";

import FilterTable from "./FilterTable";
import ExportButton from "../components/ExportButton";
import ExportDialog from "../components/ExportDialog";
import CustomerReportTable from "./CustomerReportTable";
import { BoxWithShadow, Spacing, WrapperTable } from "components";

import {
  useFetch,
  useToggle,
  useChoice,
  usePermission,
  useNotification,
  useGetHeightForTable,
} from "hooks";

import {
  responseSchema,
  EXPORT_FILE_ITEM,
  REPORTS_CUSTOMERS_OVEWVIEW_ITEM,
  MERCHANTS_STORES_ITEM,
} from "interfaces";

import { SAFE_OFFSET } from "constant";
import { EXPORT_FILES, REPORTS_CUSTOMERS_OVEWVIEW } from "apis";
import { getChoiceValue, setFilterValue, transformDate, transformUrl } from "libs";

export interface CustomerReportByTableFilterType {
  limit: number;
  offset: number;
  with_count: boolean;
  range: Range;
  first_store: MERCHANTS_STORES_ITEM | null;
  store: MERCHANTS_STORES_ITEM | null;
}

const initState: CustomerReportByTableFilterType = {
  limit: 25,
  offset: 0,
  with_count: true,
  range: {
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    key: "range",
  },
  first_store: null,
  store: null,
};

const CustomerReportByTable = () => {
  const [ref, { height }] = useGetHeightForTable();
  const [filter, setFilter] = useState(initState);

  const [startDate, setStartDate] = useState<number>(
    transformDate(startOfMonth(new Date()), "date_start")
  );
  const [endDate, setEndDate] = useState<number>(
    transformDate(endOfMonth(new Date()), "date_end")
  );

  const { export_file_extensions } = useChoice();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { open, onOpen, onClose } = useToggle();
  const { hasPermission } = usePermission("export_customer_report");

  const { data: resExportFileData, mutate: mutateExportFile } = useSWR<
    responseSchema<EXPORT_FILE_ITEM>
  >(() => {
    if (!hasPermission) return;

    return transformUrl(EXPORT_FILES, {
      get_all: true,
    });
  });

  const [fileExtension, setFileExtension] = useState<string>(
    getChoiceValue(export_file_extensions)[0]
  );

  const onSelectFileExtensionHandler = useCallback((e: SelectChangeEvent<string>) => {
    setFileExtension(e.target.value);
  }, []);

  const onExportFileHandler = useCallback(
    (filter: CustomerReportByTableFilterType, fileExtension: string) => {
      return async () => {
        try {
          setLoading(true);

          const dateStartOfWeek = transformDate(startOfMonth(new Date()), "date_start");
          const dateEndOfWeek = transformDate(endOfMonth(new Date()), "date_start");

          const filterDateStart = transformDate(filter.range.startDate, "date_start");
          const filterDateEnd = transformDate(filter.range.endDate, "date_end");

          let dateStart = filter.range.startDate ? filterDateStart : dateStartOfWeek;
          let dateEnd = filter.range.endDate ? filterDateEnd : dateEndOfWeek;

          const data = {
            date_start: formatISO(dateStart * 1000),
            date_end: formatISO(dateEnd * 1000),
            file_ext: fileExtension,
            type: "Customer_overview",
            store: filter.store ? filter.store.self : undefined,
            first_store: filter.first_store ? filter.first_store.self : undefined,
          };

          await axios.post(EXPORT_FILES, data);
          await mutateExportFile();

          enqueueSnackbarWithSuccess("Xuất file thành công");
        } catch (err) {
          enqueueSnackbarWithError(err);
        } finally {
          setLoading(false);
        }
      };
    },
    [filter]
  );

  const renderExportFile = useMemo(() => {
    if (!hasPermission) return null;

    if (resExportFileData == undefined) return null;

    return (
      <Fragment>
        <ExportButton onClick={onOpen} />

        <ExportDialog
          type="Customer_overview"
          open={open}
          loading={loading}
          onClose={onClose}
          onDownload={onExportFileHandler(filter, fileExtension)}
          onSelectFileExtension={onSelectFileExtensionHandler}
          fileExtension={fileExtension}
          exportFileData={resExportFileData.results}
        />

        <Spacing />
      </Fragment>
    );
  }, [open, filter, loading, fileExtension, hasPermission, resExportFileData]);

  const { data, itemCount, changeKey, isLoading } =
    useFetch<REPORTS_CUSTOMERS_OVEWVIEW_ITEM>(
      transformUrl(REPORTS_CUSTOMERS_OVEWVIEW, {
        ...omit(filter, "range"),
        date_start: startDate,
        date_end: endDate,
      })
    );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range") return;

        const params = cloneDeep(cloneFilter);

        set(params, "first_store", get(params, "first_store.self"));
        set(params, "store", get(params, "store.self"));

        const dateStart = transformDate(filter.range.startDate, "date_start");

        const dateEnd = transformDate(filter.range.endDate, "date_end");

        changeKey(
          transformUrl(REPORTS_CUSTOMERS_OVEWVIEW, {
            ...omit(params, "range"),
            date_start: filter.range.startDate ? dateStart : undefined,
            date_end: filter.range.endDate ? dateEnd : undefined,
          })
        );
      };
    },
    [filter]
  );

  const onClickFilterByTime = useCallback(() => {
    const cloneFilter = cloneDeep(filter);

    let dateStart: any = get(filter, "range.startDate");
    let dateEnd: any = get(filter, "range.endDate");

    dateStart = transformDate(dateStart, "date_start");
    dateEnd = transformDate(dateEnd, "date_end");

    set(cloneFilter, "first_store", get(cloneFilter, "first_store.self"));
    set(cloneFilter, "store", get(cloneFilter, "store.self"));

    changeKey(
      transformUrl(REPORTS_CUSTOMERS_OVEWVIEW, {
        ...omit(cloneFilter, "range"),
        date_start: dateStart,
        date_end: dateEnd,
        offset: 0,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(initState);

    changeKey(
      transformUrl(REPORTS_CUSTOMERS_OVEWVIEW, {
        ...omit(initState, "range"),
        date_start: startDate,
        date_end: endDate,
      })
    );
  }, [filter, startDate, endDate]);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  return (
    <Grid container>
      <Grid item xs={3}>
        <BoxWithShadow>
          {renderExportFile}

          <FilterTable
            filter={filter}
            resetFilter={resetFilterHandler}
            onFilterByTime={onClickFilterByTime}
            onDateRangeChange={onFilterChangeHandler("range")}
            onFirstStoreChange={onFilterChangeHandler("first_store")}
            onMemberOfStoreChange={onFilterChangeHandler("store")}
          />
        </BoxWithShadow>
      </Grid>
      <Grid item xs={9}>
        <WrapperTable>
          <Box ref={ref}>
            <CustomerReportTable
              data={data ?? []}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
              count={itemCount}
              isLoading={isLoading}
              pagination={pagination}
            />
          </Box>
        </WrapperTable>
      </Grid>
    </Grid>
  );
};

export default CustomerReportByTable;
