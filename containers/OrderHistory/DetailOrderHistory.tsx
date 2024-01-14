import useSWR from "swr";
import React from "react";
import { useRouter } from "next/router";
import { Grid, Typography, Container, Stack } from "@mui/material";

import { Loading, BoxWithShadow, FormControlBase, InputNumber } from "components";

import { formatDate } from "libs";
import { MERCHANTS_STORES_BRANCHES_ORDERS } from "apis";
import { MERCHANTS_STORES_BRANCHES_ORDERS_ITEM } from "interfaces";

const DetailOrderHistory = () => {
  const router = useRouter();
  const { data } = useSWR<MERCHANTS_STORES_BRANCHES_ORDERS_ITEM>(
    `${MERCHANTS_STORES_BRANCHES_ORDERS}${router.query.id}`
  );

  if (data == undefined) {
    return <Loading />;
  }

  const {
    sid,
    date_placed,
    store_name,
    branch_name,
    customer_name,
    customer_rank_name,
    customer_rank_gift_rate,
    total_cash,
    paid_point,
    paid_cash,
    transaction_fee,
    gift_point,
    note,
  } = data;

  return (
    <Container>
      <Stack spacing={3}>
        <BoxWithShadow>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                Chi Tiết Đơn Hàng
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <FormControlBase
                InputProps={{
                  readOnly: true,
                  defaultValue: sid,
                  placeholder: "Mã Đơn Hàng",
                }}
                FormLabelProps={{
                  children: "Mã Đơn Hàng",
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlBase
                InputProps={{
                  readOnly: true,
                  defaultValue: formatDate(date_placed),
                  placeholder: "Ngày Tạo",
                }}
                FormLabelProps={{
                  children: "Ngày Tạo",
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlBase
                InputProps={{
                  readOnly: true,
                  defaultValue: store_name,
                  placeholder: "Quán",
                }}
                FormLabelProps={{
                  children: "Quán",
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControlBase
                InputProps={{
                  readOnly: true,
                  defaultValue: branch_name,
                  placeholder: "Chi Nhánh",
                }}
                FormLabelProps={{
                  children: "Chi Nhánh",
                }}
              />
            </Grid>

            <Grid item xs={4}>
              <FormControlBase
                InputProps={{
                  readOnly: true,
                  defaultValue: customer_name,
                  placeholder: "Khách Hàng",
                }}
                FormLabelProps={{
                  children: "Khách Hàng",
                }}
              />
            </Grid>

            <Grid item xs={4}>
              <FormControlBase
                InputProps={{
                  readOnly: true,
                  defaultValue: customer_rank_name,
                  placeholder: "Hạng",
                }}
                FormLabelProps={{
                  children: "Hạng",
                }}
              />
            </Grid>

            <Grid item xs={4}>
              <InputNumber
                readOnly={true}
                placeholder="Ưu Đãi Hạng"
                NumberFormatProps={{
                  value: (customer_rank_gift_rate * 100).toFixed(2),
                  // value: Math.round((customer_rank_gift_rate * 100 * 100) / 100),
                  suffix: " %",
                }}
                FormLabelProps={{
                  children: "Ưu Đãi Hạng",
                }}
              />
            </Grid>

            <Grid item xs={4}>
              <InputNumber
                readOnly={true}
                placeholder="Tổng Tiền Hàng"
                NumberFormatProps={{
                  value: parseFloat(total_cash),
                  suffix: " ₫",
                }}
                FormLabelProps={{
                  children: "Tổng Tiền Hàng",
                }}
              />
            </Grid>

            <Grid item xs={4}>
              <InputNumber
                readOnly={true}
                placeholder="Điểm Sử Dụng"
                NumberFormatProps={{
                  value: paid_point,
                }}
                FormLabelProps={{
                  children: "Điểm Sử Dụng",
                }}
              />
            </Grid>

            <Grid item xs={4}>
              <InputNumber
                readOnly={true}
                placeholder="Thanh Toán"
                InputProps={{
                  sx: {
                    fontWeight: 700,
                    WebkitTextFillColor: ({ palette }) => {
                      return `${palette.primary2.main} !important`;
                    },
                  },
                }}
                NumberFormatProps={{
                  value: parseFloat(paid_cash),
                  suffix: " ₫",
                }}
                FormLabelProps={{
                  children: "Thanh toán",
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <InputNumber
                readOnly={true}
                placeholder="Phí Dịch Vụ"
                NumberFormatProps={{
                  value: transaction_fee,
                }}
                FormLabelProps={{
                  children: "Phí Dịch Vụ",
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <InputNumber
                readOnly={true}
                placeholder="Điểm Ưu Đãi"
                NumberFormatProps={{
                  value: gift_point,
                }}
                FormLabelProps={{
                  children: "Điểm Ưu Đãi",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlBase
                InputProps={{
                  value: note,
                  readOnly: true,
                  placeholder: "Ghi Chú",
                  multiline: true,
                  rows: 10,
                  sx: { padding: 1 },
                }}
                FormLabelProps={{
                  children: "Ghi Chú",
                }}
              />
            </Grid>
          </Grid>
        </BoxWithShadow>

        {/* <Stack alignItems="center">
          <Button variant="outlined" onClick={() => router.push("/doi-tac/lich-su")}>
            {BUTTON.BACK}
          </Button>
        </Stack> */}
      </Stack>
    </Container>
  );
};

export default DetailOrderHistory;
