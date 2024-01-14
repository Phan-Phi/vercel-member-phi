import React, { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, LabelProps, Cell } from "recharts";

import useSWR from "swr";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { Stack, Typography } from "@mui/material";

import { Loading, NoData } from "components";
import { IFilterProps } from "./CustomerReport";

import {
  transformUrl,
  convertValueToTupleForAddress,
  getDisplayValueFromChoiceItem,
  transformDate,
} from "libs";

import {
  CHOICES_DIVISIONS,
  MERCHANTS_STORES_BRANCHES_ORDERS,
  REPORTS_CUSTOMERS_TOP_REGION_ORDERS,
} from "apis";

import { CHART_COLOR_PALETTE } from "constant";
import { convertTimeFrameToTimeObject } from "libs/dateUtils";
import { ChoiceItem, REPORTS_CUSTOMERS_TOP_REGION_ORDERS_ITEM } from "interfaces";

interface TabOrderByRegionProps {
  filter: IFilterProps;
}

const TabOrderByRegion = (props: TabOrderByRegionProps) => {
  const { filter } = props;

  const { data } = useSWR<REPORTS_CUSTOMERS_TOP_REGION_ORDERS_ITEM[]>(() => {
    let province;

    let date_start = transformDate(filter.range.startDate, "date_start");
    let date_end = transformDate(filter.range.endDate, "date_end");

    if (!isEmpty(filter.province)) {
      province = get(filter, "province[0]");
    }

    return transformUrl(REPORTS_CUSTOMERS_TOP_REGION_ORDERS, {
      top_amounts: 5,
      date_start,
      date_end,
      province,
    });
  });

  const { data: provinceData } = useSWR<ChoiceItem[]>(CHOICES_DIVISIONS);

  const [transformedData, setTransformedData] =
    useState<REPORTS_CUSTOMERS_TOP_REGION_ORDERS_ITEM[]>();

  const { data: merchantStoreBranchOrderData } = useSWR(() => {
    let province;

    let date_start = transformDate(filter.range.startDate, "date_start");
    let date_end = transformDate(filter.range.endDate, "date_end");

    if (!isEmpty(filter.province)) {
      province = get(filter, "province[0]");
    }

    return transformUrl(MERCHANTS_STORES_BRANCHES_ORDERS, {
      with_count: true,
      date_placed_start: date_start,
      date_placed_end: date_end,
      limit: 1,
      branch_province: province,
      status: "Confirmed",
    });
  });

  useEffect(() => {
    if (
      !isEmpty(filter.province) &&
      data != undefined &&
      merchantStoreBranchOrderData != undefined
    ) {
      const total = get(merchantStoreBranchOrderData, "count");
      let sumTopFive = 0;

      (async () => {
        const temp = await Promise.all(
          data.map(async (el) => {
            sumTopFive += el.orders_count;

            return convertValueToTupleForAddress(el).then((resData) => {
              if (resData) {
                return {
                  ...el,
                  province: resData.province[1],
                  district: resData.district[1],
                };
              } else {
                return { ...el };
              }
            });
          })
        );

        if (total - sumTopFive > 0) {
          temp.push({
            orders_count: total - sumTopFive,
            province: "Khác",
            district: "Khác",
          });
        }

        setTransformedData(temp);
      })();
    }
  }, [data, filter.province, merchantStoreBranchOrderData]);

  const renderChart = useMemo(() => {
    if (
      data == undefined ||
      provinceData == undefined ||
      merchantStoreBranchOrderData == undefined
    ) {
      return null;
    }

    if (!isEmpty(filter.province)) {
      if (transformedData == undefined) {
        return <Loading />;
      }

      return (
        <ResponsiveContainer width="100%" height="100%" minWidth={500} minHeight={300}>
          <PieChart>
            <Pie
              dataKey="orders_count"
              data={transformedData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              nameKey="district"
              label={(props: LabelProps) => {
                const { x, y, textAnchor } = props;

                const displayDistrict = get(props, "district");
                const countValue = get(props, "orders_count");

                return (
                  <text x={x} y={y} textAnchor={textAnchor} fontSize={12} width={50}>
                    {`${displayDistrict}: ${countValue} `}
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
    } else {
      const total = get(merchantStoreBranchOrderData, "count");
      let sumTopFive = 0;

      const transformedData = data.map((el) => {
        sumTopFive += el.orders_count;

        return {
          ...el,
          province: getDisplayValueFromChoiceItem(provinceData, el.province),
        };
      });

      if (total - sumTopFive > 0) {
        transformedData.push({
          orders_count: total - sumTopFive,
          province: "Khác",
        });
      }

      return (
        <ResponsiveContainer width={"100%"} height="100%" minHeight={400}>
          <PieChart>
            <Pie
              dataKey="orders_count"
              data={transformedData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              nameKey="province"
              label={(props: LabelProps) => {
                const { x, y, textAnchor } = props;

                const displayProvince = get(props, "province");
                const countValue = get(props, "orders_count");

                return (
                  <text x={x} y={y} textAnchor={textAnchor} fontSize={12} width={50}>
                    {`${displayProvince}: ${countValue} `}
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
    }
  }, [
    data,
    provinceData,
    filter.province,
    merchantStoreBranchOrderData,
    transformedData,
  ]);

  if (
    data == undefined ||
    provinceData == undefined ||
    merchantStoreBranchOrderData == undefined
  ) {
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

      <Typography fontWeight="700">Số lượng đơn hàng theo khu vực</Typography>
      {renderChart}
    </Stack>
  );
};

export default TabOrderByRegion;
