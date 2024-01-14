import { Grid } from "@mui/material";
import { cloneDeep, get, omit, set } from "lodash";

import InputNumberOfUser from "./InputNumberOfUser";
import { useFetch } from "hooks";
import { MERCHANTS_TRANSACTIONS_ITEM } from "interfaces";
import { transformUrl } from "libs";
import { useRouter } from "next/router";
import { MERCHANTS } from "apis";
import { useCallback, useEffect, useState } from "react";

export type TransactionHistoryWithDetailPartnerFilterType = {
  limit: number;
  with_sum_transaction_amount: boolean;
};

const defaultFilterValue: TransactionHistoryWithDetailPartnerFilterType = {
  limit: 1,
  with_sum_transaction_amount: true,
};

export default function PointOfUser({ filter, wallet, handle }: any) {
  const { query } = useRouter();
  const { data: dataWallet } = useFetch<any>(wallet);

  const [demo, setDemo] = useState([{ point: 1, type: "Top_Up" }]);

  const { resData: resDataTopUp, changeKey } = useFetch<any>(
    transformUrl(`${MERCHANTS}${query.merchantId}/transactions/`, {
      ...defaultFilterValue,
      transaction_type: "Top_Up",
    })
  );

  const { resData: resDataWithdraw, changeKey: changeKeyWithdraw } = useFetch<any>(
    transformUrl(`${MERCHANTS}${query.merchantId}/transactions/`, {
      ...defaultFilterValue,
      transaction_type: "Withdraw",
    })
  );

  const { resData: resDataFee, changeKey: changeKeyFee } = useFetch<any>(
    transformUrl(`${MERCHANTS}${query.merchantId}/transactions/`, {
      ...defaultFilterValue,
      transaction_type: "Fee",
    })
  );

  const { resData: resDataCustomerUsePoint, changeKey: changeKeyCustomerUsePoint } =
    useFetch<any>(
      transformUrl(`${MERCHANTS}${query.merchantId}/transactions/`, {
        ...defaultFilterValue,
        transaction_type: "Customer_Use_Point",
      })
    );

  const { resData: resDataGiftPoint, changeKey: changeKeyGiftPoint } = useFetch<any>(
    transformUrl(`${MERCHANTS}${query.merchantId}/transactions/`, {
      ...defaultFilterValue,
      transaction_type: "Gift_Point",
    })
  );

  useEffect(() => {
    if (resDataTopUp) {
      handle({ point: resDataTopUp.sum_transaction_amount, type: "Top_Up" });
    }
  }, [resDataTopUp]);
  useEffect(() => {
    if (resDataWithdraw) {
      handle({ point: resDataWithdraw.sum_transaction_amount, type: "Withdraw" });
    }
  }, [resDataWithdraw]);
  useEffect(() => {
    if (resDataFee) {
      handle({ point: resDataFee.sum_transaction_amount, type: "Fee" });
    }
  }, [resDataFee]);
  useEffect(() => {
    if (resDataCustomerUsePoint) {
      handle({
        point: resDataCustomerUsePoint.sum_transaction_amount,
        type: "Customer_Use_Point",
      });
    }
  }, [resDataCustomerUsePoint]);
  useEffect(() => {
    if (resDataGiftPoint) {
      handle({
        point: resDataGiftPoint.sum_transaction_amount,
        type: "Gift_Point",
      });
    }
  }, [resDataGiftPoint]);

  // useEffect(() => {
  //   if (resDataTopUp) {
  //     if (demo.length === 0) {
  //       setDemo([
  //         ...demo,
  //         { point: resDataTopUp.sum_transaction_amount, type: "Top_Up" },
  //       ]);
  //     } else {
  //       let dataInitial = demo;
  //       const index = dataInitial.findIndex((el) => el.type === "Top_Up");
  //       dataInitial.splice(index, 1);

  //       setDemo([
  //         ...dataInitial,
  //         { point: resDataTopUp.sum_transaction_amount, type: "Top_Up" },
  //       ]);
  //     }
  //   }

  //   if (resDataWithdraw) {
  //     if (demo.length === 0) {
  //       setDemo([
  //         ...demo,
  //         { point: resDataWithdraw.sum_transaction_amount, type: "Withdraw" },
  //       ]);
  //     } else {
  //       let dataInitial = demo;
  //       const index = dataInitial.findIndex((el) => el.type === "Withdraw");
  //       dataInitial.splice(index, 1);

  //       setDemo([
  //         ...dataInitial,
  //         { point: resDataWithdraw.sum_transaction_amount, type: "Withdraw" },
  //       ]);
  //     }
  //   }

  //   if (resDataFee) {
  //     console.log("🚀 ~ useEffect ~ demo:", demo);

  //     if (demo.length === 0) {
  //       setDemo([...demo, { point: resDataFee.sum_transaction_amount, type: "Fee" }]);
  //     } else {
  //       let dataInitial = demo;
  //       console.log("🚀 ~ useEffect ~ dataInitial:", dataInitial);
  //       const index = dataInitial.findIndex((el) => el.type === "Fee");
  //       dataInitial.splice(index, 1);

  //       setDemo([
  //         ...dataInitial,
  //         { point: resDataFee.sum_transaction_amount, type: "Fee" },
  //       ]);
  //     }
  //   }
  // }, [resDataFee, resDataWithdraw, resDataTopUp]);
  // console.log("🚀 ~ PointOfUser ~ demo:", demo);

  return (
    <Grid container>
      <Grid item xs={3}>
        <InputNumberOfUser
          value={dataWallet ? dataWallet[0].point_in - dataWallet[0].point_out : 0}
          label="Điểm hiện tại"
        />
      </Grid>
      <Grid item xs={3}>
        {resDataGiftPoint && resDataFee && resDataTopUp && (
          <InputNumberOfUser
            value={
              resDataGiftPoint.sum_transaction_amount +
              resDataFee.sum_transaction_amount +
              resDataTopUp.sum_transaction_amount
            }
            label="Tổng điểm đã tích"
          />
        )}
      </Grid>
      <Grid item xs={3}>
        {resDataCustomerUsePoint && resDataTopUp && (
          <InputNumberOfUser
            value={
              resDataCustomerUsePoint.sum_transaction_amount +
              resDataTopUp.sum_transaction_amount
            }
            label="Tổng điểm đã nhận"
          />
        )}
      </Grid>

      <Grid item xs={3}>
        <InputNumberOfUser value={1} label="Hạn mức điểm" />
      </Grid>

      <Grid item xs={4}>
        <InputNumberOfUser
          value={resDataGiftPoint ? resDataGiftPoint.sum_transaction_amount : 0}
          label="Tích điểm/ Tặng điểm"
        />
      </Grid>

      <Grid item xs={4}>
        <InputNumberOfUser
          value={
            resDataCustomerUsePoint ? resDataCustomerUsePoint.sum_transaction_amount : 0
          }
          label="Khách sử dụng điểm"
        />
      </Grid>

      <Grid item xs={4}>
        <InputNumberOfUser
          value={resDataFee ? resDataFee.sum_transaction_amount : 0}
          label="Phí dịch vụ"
        />
      </Grid>

      <Grid item xs={4}>
        <InputNumberOfUser
          value={resDataTopUp ? resDataTopUp.sum_transaction_amount : 0}
          label="Nạp điểm"
        />
      </Grid>

      <Grid item xs={4}>
        <InputNumberOfUser
          value={resDataWithdraw ? resDataWithdraw.sum_transaction_amount : 0}
          label="Rút điểm"
        />
      </Grid>

      <Grid item xs={4}>
        <InputNumberOfUser
          value={resDataWithdraw ? resDataWithdraw.sum_transaction_amount : 0}
          label="Khối lượng giao dịch"
        />
      </Grid>
    </Grid>
  );
}
