import useSWR from "swr";
import { cloneDeep, get, omit } from "lodash";

import axios from "axios.config";
import PartnerReportTable from "./PartnerReportTable";
import ExportDialog from "../components/ExportDialog";
import ExportButton from "../components/ExportButton";
import FilterPartnerReport from "./FilterPartnerReport";

import { SAFE_OFFSET } from "constant";
import { Range } from "react-date-range";
import { Box, Grid, SelectChangeEvent } from "@mui/material";
import { formatISO, endOfMonth, startOfMonth } from "date-fns";
import { EXPORT_FILES, REPORTS_MERCHANTS_OVEWVIEW } from "apis";
import { Fragment, useCallback, useMemo, useState } from "react";
import { BoxWithShadow, Spacing, WrapperTable } from "components";
import { getChoiceValue, setFilterValue, transformDate, transformUrl } from "libs";

import {
  responseSchema,
  EXPORT_FILE_ITEM,
  REPORTS_MERCHANTS_OVEWVIEW_ITEM,
} from "interfaces";

import {
  useFetch,
  useToggle,
  useChoice,
  usePermission,
  useNotification,
  useGetHeightForTable,
} from "hooks";

export type PartnerReportByTableFilterType = {
  limit: number;
  offset: number;
  with_count: boolean;
  range: Range;
};

const initState: PartnerReportByTableFilterType = {
  limit: 25,
  offset: 0,
  with_count: true,
  range: {
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    key: "range",
  },
};

type PartnerReportByTableProps = {
  currentTab: number;
};

const PartnerReportByTable = ({ currentTab }: PartnerReportByTableProps) => {
  const { export_file_extensions } = useChoice();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const [ref, { height }] = useGetHeightForTable();

  const { open, onOpen, onClose } = useToggle();

  const { hasPermission } = usePermission("export_merchant_report");

  const [fileExtension, setFileExtension] = useState<string>(
    getChoiceValue(export_file_extensions)[0]
  );

  const [filter, setFilter] = useState<PartnerReportByTableFilterType>(initState);
  const [startDate, setStartDate] = useState<number>(
    transformDate(startOfMonth(new Date()), "date_start")
  );
  const [endDate, setEndDate] = useState<number>(
    transformDate(endOfMonth(new Date()), "date_end")
  );

  const { data: resExportFileData, mutate: mutateExportFile } = useSWR<
    responseSchema<EXPORT_FILE_ITEM>
  >(() => {
    if (!hasPermission) return;

    return transformUrl(EXPORT_FILES, {
      get_all: true,
    });
  });

  const onSelectFileExtensionHandler = useCallback((e: SelectChangeEvent<string>) => {
    setFileExtension(e.target.value);
  }, []);

  const onExportFileHandler = useCallback(
    (filter: PartnerReportByTableFilterType, fileExtension: string) => {
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
            type: "Merchant_overview",
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

    if (currentTab !== 0) return null;

    return (
      <Fragment>
        <ExportButton onClick={onOpen} />

        <ExportDialog
          type="Merchant_overview"
          open={open}
          loading={loading}
          onClose={onClose}
          onDownload={onExportFileHandler(filter, fileExtension)}
          onSelectFileExtension={onSelectFileExtensionHandler}
          exportFileData={resExportFileData.results}
          fileExtension={fileExtension}
        />

        <Spacing />
      </Fragment>
    );
  }, [
    open,
    filter,
    loading,
    currentTab,
    fileExtension,
    hasPermission,
    resExportFileData,
  ]);

  const { data, itemCount, changeKey, isLoading } =
    useFetch<REPORTS_MERCHANTS_OVEWVIEW_ITEM>(
      transformUrl(REPORTS_MERCHANTS_OVEWVIEW, {
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

        const dateStart = transformDate(filter.range.startDate, "date_start");

        const dateEnd = transformDate(filter.range.endDate, "date_end");

        changeKey(
          transformUrl(REPORTS_MERCHANTS_OVEWVIEW, {
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

    changeKey(
      transformUrl(REPORTS_MERCHANTS_OVEWVIEW, {
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
      transformUrl(REPORTS_MERCHANTS_OVEWVIEW, {
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

          <FilterPartnerReport
            filter={filter}
            resetFilter={resetFilterHandler}
            onFilterByTime={onClickFilterByTime}
            onDateRangeChange={onFilterChangeHandler("range")}
          />
        </BoxWithShadow>
      </Grid>

      <Grid item xs={9}>
        <WrapperTable>
          <Box ref={ref}>
            <PartnerReportTable
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

export default PartnerReportByTable;
