import { signIn, signOut } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, LabelProps, Cell } from "recharts";

import useSWR from "swr";
import axios from "axios.config";
import originalAxios from "axios";
import { get, isEmpty } from "lodash";
import { Stack, Typography } from "@mui/material";

import { Loading, NoData } from "components";
import { IFilterProps } from "./CustomerReport";

import {
  MERCHANTS_STORES_ITEM,
  REPORTS_CUSTOMERS_TOP_STORE_CATEGORY_ORDERS_ITEM,
} from "interfaces";

import {
  MERCHANTS_STORES_BRANCHES_ORDERS,
  REPORTS_CUSTOMERS_TOP_STORE_CATEGORY_ORDERS,
} from "apis";

import { useNotification } from "hooks";
import { CHART_COLOR_PALETTE } from "constant";
import { convertTimeFrameToTimeObject } from "libs/dateUtils";
import { transformUrl, handleResponseAxiosError, transformDate } from "libs";

interface TabOrderByCategoryProps {
  filter: IFilterProps;
}

const TabOrderByCategory = (props: TabOrderByCategoryProps) => {
  const { filter } = props;

  const { enqueueSnackbarWithError } = useNotification();

  const { data } = useSWR<REPORTS_CUSTOMERS_TOP_STORE_CATEGORY_ORDERS_ITEM[]>(() => {
    let date_start = transformDate(filter.range.startDate, "date_start");
    let date_end = transformDate(filter.range.endDate, "date_end");

    return transformUrl(REPORTS_CUSTOMERS_TOP_STORE_CATEGORY_ORDERS, {
      top_amounts: 5,
      date_start,
      date_end,
    });
  });

  const [transformedData, setTransformedData] =
    useState<REPORTS_CUSTOMERS_TOP_STORE_CATEGORY_ORDERS_ITEM[]>();

  const { data: merchantStoreBranchOrderData } = useSWR(() => {
    let date_start = transformDate(filter.range.startDate, "date_start");
    let date_end = transformDate(filter.range.endDate, "date_end");

    return transformUrl(MERCHANTS_STORES_BRANCHES_ORDERS, {
      with_count: true,
      date_placed_start: date_start,
      date_placed_end: date_end,
      limit: 1,
      status: "Confirmed",
    });
  });

  useEffect(() => {
    if (data == undefined || merchantStoreBranchOrderData == undefined) {
      return;
    }

    (async () => {
      try {
        const total = get(merchantStoreBranchOrderData, "count");
        let sumTopFive = 0;

        const temp = await Promise.all(
          data.map(async (el) => {
            sumTopFive += el.orders_count;

            if (el.category) {
              return axios.get<MERCHANTS_STORES_ITEM>(el.category).then(({ data }) => {
                return {
                  orders_count: el.orders_count,
                  category: data.name,
                };
              });
            }

            return {
              orders_count: el.orders_count,
              category: "",
            };
          })
        );

        if (total > sumTopFive) {
          temp.push({
            orders_count: total - sumTopFive,
            category: "Khác",
          });
        }

        setTransformedData(temp);
      } catch (err) {
        enqueueSnackbarWithError(err);

        if (originalAxios.isAxiosError(err)) {
          handleResponseAxiosError(err, signIn, signOut);
        }
      }
    })();
  }, [data, merchantStoreBranchOrderData]);

  const renderChart = useMemo(() => {
    if (transformedData == undefined) {
      return null;
    }

    return (
      <ResponsiveContainer width={"100%"} height="100%" minWidth={500} minHeight={300}>
        <PieChart>
          <Pie
            dataKey="orders_count"
            data={transformedData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            nameKey="category"
            label={(props: LabelProps) => {
              const { x, y, textAnchor } = props;

              const categoryName = get(props, "category");
              const countValue = get(props, "orders_count");

              return (
                <text x={x} y={y} textAnchor={textAnchor} fontSize={12} width={50}>
                  {`${categoryName}: ${countValue} `}
                </text>
              );
            }}
          >
            {transformedData.map((el, idx) => {
              return (
                <Cell
                  key={`cell-${idx}`}
                  fill={CHART_COLOR_PALETTE[idx % CHART_COLOR_PALETTE.length]}
                />
              );
            })}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }, [transformedData]);

  if (transformedData == undefined || merchantStoreBranchOrderData == undefined) {
    return <Loading />;
  }

  if (isEmpty(data)) {
    return <NoData />;
  }

  return (
    <Stack alignItems="center" spacing={2}>
      <Typography variant="body2">
        {"Tổng đơn hàng: "}
        <Typography component={"span"} color="primary2.main" fontWeight="700">
          {get(merchantStoreBranchOrderData, "count")}
        </Typography>
      </Typography>

      <Typography fontWeight="700">Số lượng đơn hàng theo danh mục quán</Typography>
      {renderChart}
    </Stack>
  );
};

export default TabOrderByCategory;
