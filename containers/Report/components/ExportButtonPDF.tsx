import useSWR from "swr";
import { omit } from "lodash";
import { Fragment, useEffect, useMemo, useState } from "react";
import { StyleSheet, usePDF, Font } from "@react-pdf/renderer";
import axios from "axios.config";

import { MERCHANTS } from "apis";
import { useFetch } from "hooks";
import { useRouter } from "next/router";
import { transformDate, transformUrl } from "libs";
import { MERCHANTS_TRANSACTIONS_ITEM } from "interfaces";
import { Button, ButtonProps, Typography } from "@mui/material";

import Pdf from "containers/Partner/Pdf/Pdf";
import addDemo from "libs/addDemo";
import { AxiosResponse } from "axios";

export type TransactionHistoryWithDetailPartnerFilterType = {
  limit: number;
  offset: number;
  with_count: boolean;
  search?: string;
  transaction_type: string;
};

const defaultFilterValue: TransactionHistoryWithDetailPartnerFilterType = {
  limit: 100,
  offset: 0,
  with_count: true,
  search: "",
  transaction_type: "",
};

const ExportButtonPDF = ({
  merchantData,
  filter,
  resDataWithdraw,
  count,
  infoPoint,
  handleResetPdf,
  activePdf,
}: any) => {
  // console.log("🚀 ~ count:", count);
  const { query } = useRouter();
  const [dataTable, setDataTable] = useState<any>([]);
  const [dataTableOrder, setDataTableOrder] = useState<any>([]);
  const [countTable, setCountTable] = useState<number>(0);

  const { data, resData, isLoading, itemCount, changeKey } =
    useFetch<MERCHANTS_TRANSACTIONS_ITEM>(
      transformUrl(`${MERCHANTS}${query.merchantId}/transactions/`, {
        // ...omit(filter, "range"),
        ...defaultFilterValue,
        date_created_start: filter.range.startDate
          ? transformDate(filter.range.startDate, "date_start")
          : undefined,
        date_created_end: filter.range.endDate
          ? transformDate(filter.range.endDate, "date_end")
          : undefined,
      })
    );

  useEffect(() => {
    // console.log("🚀 ~ useEffect ~ filter:", filter);

    if (resData == undefined) return;
    if (itemCount > count) return;

    changeKey(
      resData.next as any
      // transformUrl(`${MERCHANTS}${query.merchantId}/transactions/`, {
      //   ...omit(defaultFilterValue, "range"),
      //   date_created_start: filter.range.startDate
      //     ? transformDate(filter.range.startDate, "date_start")
      //     : undefined,
      //   date_created_end: filter.range.endDate
      //     ? transformDate(filter.range.endDate, "date_end")
      //     : undefined,
      // })
    );
  }, [filter.range.startDate, resData, count]);

  useEffect(() => {
    if (resData == undefined) return;
    if (itemCount > count) return;

    // setCountTable((el:number) => {
    //   return

    // })
  }, [itemCount]);

  useEffect(() => {
    if (resData == undefined) return;
    setDataTable((el: any) => {
      return [...el, ...resData.results];
    });
  }, [resData]);
  // console.log("🚀 ~ resData:", resData);

  useEffect(() => {
    if (count === dataTable.length) {
      Promise.all<AxiosResponse<any>>(dataTable.map((el: any) => axios.get(el.source)))
        .then((resData) => {
          // console.log("🚀 ~ .then ~ resData:", resData);
          setDataTableOrder(resData);
          // return resData.map((el) => {
          //   const { data } = el;

          //   return data.name;
          // });
        })

        .catch((err) => {});

      return () => {
        // controller.abort();
      };
    }
  }, [dataTable]);

  const [instance, updateInstance] = usePDF({
    document: <></>,
  });
  // console.log("🚀 ~ useEffect ~ dataTable:", dataTable);

  useEffect(() => {
    if (count === dataTable.length && count === dataTableOrder.length) {
      // const handler = async () => {
      //   try {
      //     const results = await addDemo(dataTable);
      //     console.log("🚀 ~ handler ~ results:", results);
      //   } catch (err) {
      //     // enqueueSnackbarWithError(err);
      //   } finally {
      //   }
      // };
      // handler();
      updateInstance(
        <Pdf
          // merchantData={merchantData}
          // resDataWithdraw={resDataWithdraw}
          // filter={filter}
          dataTable={dataTable}
          dataTableOrder={dataTableOrder}
          // query={query}
          // infoPoint={infoPoint}
        />
      );
    }
  }, [
    // merchantData,
    // filter,
    // itemCount,
    // count,
    // query,
    dataTable,
    dataTableOrder,
    // infoPoint,
    // resDataWithdraw,
  ]);

  // console.log("🚀 ~ ExportButtonPDF ~ instance:", instance);
  // const { data: datademo, resData: resDataDemo } = useFetch<any>(
  //   "/admin/merchants/stores/branches/orders/20b4261a-3f12-4cce-9779-c3aeb7f0ce0e/"
  // );
  // console.log("🚀 ~ datademo:", resDataDemo);

  const render = useMemo(() => {
    return (
      <Fragment>
        {instance.loading ? (
          <Typography>Đang tải...</Typography>
        ) : (
          <a
            href={instance.url as any}
            download="test.pdf"
            // onClick={() => {
            //   handleResetPdf();
            // }}
          >
            Tải báo cáo (Pdf)
          </a>
        )}
      </Fragment>
    );
  }, [instance]);

  return render;
};

export default ExportButtonPDF;
// const { data: datademo } = useSWR(
//   "https://member-api.t-solution.vn/admin/merchants/stores/branches/orders/20b4261a-3f12-4cce-9779-c3aeb7f0ce0e/"
// );
// console.log("🚀 ~ ExportButtonPDF ~ datademo:", datademo);

// updateInstance(
//   <Pdf
//     merchantData={merchantData}
//     resDataWithdraw={resDataWithdraw}
//     filter={filter}
//     dataTable={dataTable}
//     // dataTable={[]}
//     query={query}
//     infoPoint={infoPoint}
//   />
// );
