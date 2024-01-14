import { cloneDeep, get, omit, set } from "lodash";

import { Sticky } from "hocs";
import { PATHNAME } from "routes";
import { useRouter } from "next/router";
import { Range } from "react-date-range";
import { EXPORT_FILES, MERCHANTS } from "apis";
import { BUTTON, SAFE_OFFSET } from "constant";
import { endOfMonth, formatISO, startOfMonth } from "date-fns";
import { Fragment, useCallback, useMemo, useState } from "react";
import { getChoiceValue, setFilterValue, transformDate, transformUrl } from "libs";
import { Grid, Typography, Stack, Button, Box, SelectChangeEvent } from "@mui/material";

import useSWR from "swr";
import axios from "axios.config";
import SearchField from "components/Filter/SearchField";
import TransactionHistoryWithDetailPartnerTable from "./TransactionHistoryWithDetailPartnerTable";
import FilterTransactionHistoryWithDetailPartner from "./FilterTransactionHistoryWithDetailPartner";

import {
  useFetch,
  useToggle,
  useChoice,
  usePermission,
  useNotification,
  useGetHeightForTable,
} from "hooks";
import {
  Spacing,
  Loading,
  Container,
  InputNumber,
  WrapperTable,
  BoxWithShadow,
} from "components";

import {
  MERCHANTS_ITEM,
  responseSchema,
  EXPORT_FILE_ITEM,
  MERCHANTS_WALLETS_ITEM,
  MERCHANTS_TRANSACTIONS_ITEM,
} from "interfaces";
import PointOfUser from "./components/PointOfUser";
import ExportButton from "containers/Report/components/ExportButton";
import ExportHistoryDialog from "./components/export/ExportHistoryDialog";
import ExportDialog from "components/Export/ExportDialog";
import ExportButtonPDF from "containers/Report/components/ExportButtonPDF";
import addDemo from "libs/addDemo";

export type TransactionHistoryWithDetailPartnerFilterType = {
  limit: number;
  offset: number;
  with_count: boolean;
  search?: string;
  transaction_type: string;
  range: Range;
};

const defaultFilterValue: TransactionHistoryWithDetailPartnerFilterType = {
  limit: 25,
  offset: 0,
  with_count: true,
  search: "",
  transaction_type: "",
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
};

export type PartnerReportByTableFilterType = {
  limit: number;
  offset: number;
  with_count: boolean;
  range: Range;
  transaction_type: string;
};

export type TransactionHistoryWithDetailPartnerFilterTypePoint = {
  limit: number;
  with_sum_transaction_amount: boolean;
};

const defaultFilterValuePoint: TransactionHistoryWithDetailPartnerFilterTypePoint = {
  limit: 1,
  with_sum_transaction_amount: true,
};

const TransactionHistoryWithDetailPartner = () => {
  const router = useRouter();
  const { open, onOpen, onClose } = useToggle();
  const { open: openPDF, onOpen: onOpenPDF, onClose: onClosePDF } = useToggle();
  const { export_file_extensions } = useChoice();

  const [ref, { height }] = useGetHeightForTable();

  const [infoPoint, setInfoPoint] = useState<any>([]);
  const [activePdf, setActivePdf] = useState<boolean>(false);
  const [resetPdf, setResetPdf] = useState<boolean>(false);
  const [filter, setFilter] = useState(defaultFilterValue);
  const [fileExtension, setFileExtension] = useState<string>(
    getChoiceValue(export_file_extensions)[0]
  );
  const { hasPermission } = usePermission("export_transaction");

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { data: merchantData } = useSWR<MERCHANTS_ITEM>(
    `${MERCHANTS}${router.query.merchantId}`
  );

  const { data: merchantWalletData } = useSWR<responseSchema<MERCHANTS_WALLETS_ITEM>>(
    () => {
      if (merchantData) {
        const { wallet } = merchantData;

        return wallet;
      }
    }
  );

  // infoPoint
  const { resData: resDataWithdraw, changeKey: changeKeyWithdraw } = useFetch<any>(
    transformUrl(`${MERCHANTS}${router.query.merchantId}/transactions/`, {
      ...defaultFilterValuePoint,
      transaction_type: "Withdraw",
    })
  );
  //-----

  const { data, isLoading, itemCount, changeKey } = useFetch<MERCHANTS_TRANSACTIONS_ITEM>(
    transformUrl(`${MERCHANTS}${router.query.merchantId}/transactions/`, {
      ...omit(filter, "range"),
    })
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

  const handle = useCallback(
    (value) => {
      if (infoPoint.length === 0) {
        setInfoPoint((el: any) => {
          return [...el, value];
        });
        return;
      }

      let dataInitial = infoPoint;
      const index = dataInitial.findIndex((el: any) => el.type === value.type);
      dataInitial.splice(index, 1);
      setInfoPoint((item: any) => {
        return [...item, dataInitial];
      });
    },
    [infoPoint]
  );

  const handleResetPdf = useCallback(() => {
    setActivePdf(false);
  }, []);

  const onExportFileHandler = useCallback(
    (
      filter: PartnerReportByTableFilterType,
      merchantData: any,
      fileExtension: string
    ) => {
      return async () => {
        try {
          if (merchantData == undefined) return;
          setLoading(true);

          const dateStartOfWeek = transformDate(startOfMonth(new Date()), "date_start");
          const dateEndOfWeek = transformDate(endOfMonth(new Date()), "date_start");

          const filterDateStart = transformDate(filter.range.startDate, "date_start");
          const filterDateEnd = transformDate(filter.range.endDate, "date_end");

          let dateStart = filter.range.startDate ? filterDateStart : dateStartOfWeek;
          let dateEnd = filter.range.endDate ? filterDateEnd : dateEndOfWeek;

          const data = {
            type: "Transaction",
            of: merchantData.self,
            file_ext: fileExtension,
            date_end: formatISO(dateEnd * 1000),
            date_start: formatISO(dateStart * 1000),
            transaction_type: filter.transaction_type,
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
    [filter, merchantData]
  );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        if (key === "transaction_type") {
          set(cloneFilter, key, value);
        }

        setFilter(cloneFilter);

        if (key === "range") return;

        const params = cloneDeep(cloneFilter);

        const dateStart = transformDate(filter.range.startDate, "date_start");
        const dateEnd = transformDate(filter.range.endDate, "date_end");

        changeKey(
          transformUrl(`${MERCHANTS}${router.query.merchantId}/transactions/`, {
            ...omit(params, "range"),
            date_created_start: filter.range.startDate ? dateStart : undefined,
            date_created_end: filter.range.endDate ? dateEnd : undefined,
          })
        );
      };
    },
    [filter, router]
  );

  const onClickFilterByTime = useCallback(() => {
    const cloneFilter = cloneDeep(filter);

    let dateStart: any = get(filter, "range.startDate");
    let dateEnd: any = get(filter, "range.endDate");

    dateStart = transformDate(dateStart, "date_start");
    dateEnd = transformDate(dateEnd, "date_end");

    changeKey(
      transformUrl(`${MERCHANTS}${router.query.merchantId}/transactions/`, {
        ...omit(cloneFilter, "range"),
        date_created_start: dateStart,
        date_created_end: dateEnd,
        offset: 0,
      })
    );
  }, [filter, router]);

  const onViewHandler = useCallback((props: any) => {
    const { row } = props;
    console.log("🚀 ~ onViewHandler ~ row:", row);

    const sourceType = row.original.source_type;
    if (sourceType === "cash.pointnote") {
      const pointNoteId = row.original.source
        .split("/")
        .filter((el: any) => el !== "")
        .pop();

      if (pointNoteId) {
        window.open(
          `/${PATHNAME.DOI_TAC}/${PATHNAME.XU_LY_DIEM}/${pointNoteId}`,
          "_blank"
        );
      }
    } else if (sourceType === "store_order.order") {
      const orderId = row.original.source
        .split("/")
        .filter((el: any) => el !== "")
        .pop();

      if (orderId) {
        window.open(`/${PATHNAME.LICH_SU_DON_HANG}/${orderId}`, "_blank");
      }
    }
  }, []);

  const onGotoHandler = useCallback((data: any) => {
    return async (e: React.SyntheticEvent) => {
      e.preventDefault();

      const sourceType = get(data, "source_type");

      if (sourceType === "cash.pointnote") {
        const url: string = get(data, "owner");

        const id = url
          .split("/")
          .filter((el) => el !== "")
          .pop();

        window.open(`/${PATHNAME.DOI_TAC}/${PATHNAME.TAI_KHOAN}/${id}`);
      } else if (sourceType === "store_order.order") {
        const url: string = get(data, "customer");

        const id = url
          .split("/")
          .filter((el) => el !== "")
          .pop();

        window.open(`/${PATHNAME.KHACH_HANG}/${PATHNAME.TAI_KHOAN}/${id}`);
      }
    };
  }, []);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(
      transformUrl(
        `${MERCHANTS}${router.query.merchantId}/transactions/`,
        omit(defaultFilterValue, "range")
      )
    );
  }, [filter, router]);

  const onGobackHandler = useCallback(() => {
    router.push(`/${PATHNAME.DOI_TAC}/${PATHNAME.LICH_SU}`);
  }, []);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  const renderMerchantInfo = useMemo(() => {
    if (merchantData == undefined) {
      return <Loading />;
    }

    const { last_name, first_name, wallet } = merchantData;

    // const merchantWallet = merchantWalletData.results[0];

    const fullName = `${last_name} ${first_name}`;

    // let renderPoint = null;

    // if (merchantWallet) {
    //   const { point_in, point_out } = merchantWallet;

    //   const point = point_in - point_out;

    //   renderPoint = (
    //     <InputNumber
    //       readOnly={true}
    //       NumberFormatProps={{
    //         value: point,
    //       }}
    //       FormLabelProps={{
    //         children: "Điểm Hiện Tại",
    //       }}
    //       InputProps={{
    //         sx: {
    //           WebkitTextFillColor: ({ palette }) => {
    //             return `${palette.primary2.main} !important`;
    //           },
    //         },
    //       }}
    //     />
    //   );
    // }

    return (
      <Stack spacing={2}>
        <Typography color="primary2.main" variant="h2">
          {fullName}
        </Typography>
        <Box>
          <PointOfUser filter={filter} wallet={wallet} handle={handle} />
        </Box>
        {/* {renderPoint} */}
      </Stack>
    );
  }, [
    merchantData,
    filter,
    // merchantWalletData
  ]);

  const renderExportFile = useMemo(() => {
    if (!hasPermission) return null;

    if (resExportFileData == undefined) return null;

    return (
      <Fragment>
        <ExportButton onClick={onOpen} />

        <ExportDialog
          type="Transaction"
          open={open}
          loading={loading}
          onClose={onClose}
          onDownload={onExportFileHandler(filter, merchantData, fileExtension)}
          onSelectFileExtension={onSelectFileExtensionHandler}
          exportFileData={resExportFileData.results}
          fileExtension={fileExtension}
        />

        <Spacing />
      </Fragment>
    );
  }, [open, filter, loading, fileExtension, hasPermission, resExportFileData]);

  const renderPDF = useMemo(() => {
    if (activePdf) {
      return (
        <Fragment>
          {/* <ExportButtonPDF onClick={onOpenPDF} /> */}

          <ExportButtonPDF
            merchantData={merchantData}
            filter={filter}
            resDataWithdraw={resDataWithdraw}
            count={itemCount}
            handleResetPdf={handleResetPdf}
            // infoPoint={infoPoint}
            activePdf={activePdf}
          />
          <Spacing />
        </Fragment>
      );
    }
    return;
  }, [
    merchantData,
    filter,
    itemCount,
    activePdf,
    // infoPoint,
    handleResetPdf,
    resDataWithdraw,
  ]);

  // const handler = async () => {
  //   try {
  //     const results = await addDemo(list);
  //   } catch (err) {
  //     enqueueSnackbarWithError(err);
  //   } finally {
  //   }
  // };

  return (
    <Container>
      <Grid container>
        <Grid item xs={12}>
          {/* <BoxWithShadow>{renderMerchantInfo}</BoxWithShadow> */}
        </Grid>

        <Grid item xs={3}>
          {renderExportFile}

          <BoxWithShadow textAlign="center">
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setActivePdf(true);
              }}
            >
              Xuất báo cáo
            </Button>
            {renderPDF}
          </BoxWithShadow>

          <FilterTransactionHistoryWithDetailPartner
            filter={filter}
            resetFilter={resetFilterHandler}
            onFilterByTime={onClickFilterByTime}
            onFilterSelect={onFilterChangeHandler("transaction_type")}
            onDateRangeChange={onFilterChangeHandler("range")}
          />
        </Grid>
        <Grid item xs={9}>
          <Sticky>
            <Stack spacing={3}>
              <SearchField
                initSearch={filter.search}
                onChange={onFilterChangeHandler("search")}
              />
              <WrapperTable>
                <Box ref={ref}>
                  <TransactionHistoryWithDetailPartnerTable
                    data={data ?? []}
                    onPageChange={onFilterChangeHandler("page")}
                    onPageSizeChange={onFilterChangeHandler("pageSize")}
                    maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom) - 90}
                    count={itemCount}
                    isLoading={isLoading}
                    pagination={pagination}
                    onGotoHandler={onGotoHandler}
                    onViewHandler={onViewHandler}
                  />
                </Box>
              </WrapperTable>
            </Stack>
          </Sticky>
        </Grid>

        <Grid item xs={12}>
          <Stack alignItems="center">
            <Button variant="outlined" onClick={onGobackHandler}>
              {BUTTON.BACK}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TransactionHistoryWithDetailPartner;
