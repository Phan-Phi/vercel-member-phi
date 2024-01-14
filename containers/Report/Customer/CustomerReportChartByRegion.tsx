import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, LabelProps, Cell } from "recharts";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { Stack, Typography } from "@mui/material";

import { Loading, NoData } from "components";
import { IFilterProps } from "./CustomerReport";

import {
  CHOICES_DIVISIONS,
  CUSTOMERS_ADDRESSES,
  REPORTS_CUSTOMERS_TOP_REGION_CUSTOMERS,
} from "apis";

import {
  transformUrl,
  getDisplayValueFromChoiceItem,
  convertValueToTupleForAddress,
  transformDate,
} from "libs";

import { CHART_COLOR_PALETTE } from "constant";
import { convertTimeFrameToTimeObject } from "libs/dateUtils";
import { ChoiceItem, REPORTS_CUSTOMERS_TOP_REGION_CUSTOMERS_ITEM } from "interfaces";

interface CustomerReportChartByRegionProps {
  filter: IFilterProps;
}

const CustomerReportChartByRegion = (props: CustomerReportChartByRegionProps) => {
  const { filter } = props;

  const { data } = useSWR<REPORTS_CUSTOMERS_TOP_REGION_CUSTOMERS_ITEM[]>(() => {
    let province;

    let date_start = transformDate(filter.range.startDate, "date_start");
    let date_end = transformDate(filter.range.endDate, "date_end");

    if (!isEmpty(filter.province)) {
      province = get(filter, "province[0]");
    }

    return transformUrl(REPORTS_CUSTOMERS_TOP_REGION_CUSTOMERS, {
      top_amounts: 5,
      date_start,
      date_end,
      province,
    });
  });

  const { data: provinceData } = useSWR<ChoiceItem[]>(CHOICES_DIVISIONS);

  const { data: customerData } = useSWR(() => {
    let province;

    let date_start = transformDate(filter.range.startDate, "date_start");
    let date_end = transformDate(filter.range.endDate, "date_end");

    if (!isEmpty(filter.province)) {
      province = get(filter, "province[0]");
    }

    if (province) {
      return transformUrl(CUSTOMERS_ADDRESSES, {
        with_count_distinct_district: true,
        user_date_joined_start: date_start,
        user_date_joined_end: date_end,
        limit: 1,
        province,
      });
    }

    return transformUrl(CUSTOMERS_ADDRESSES, {
      with_count_distinct_province: true,
      user_date_joined_start: date_start,
      user_date_joined_end: date_end,
      limit: 1,
    });
  });

  const [transformedCustomerData, setTransformedCustomerData] =
    useState<REPORTS_CUSTOMERS_TOP_REGION_CUSTOMERS_ITEM[]>();

  useEffect(() => {
    if (!isEmpty(filter.province) && data != undefined && customerData != undefined) {
      const total = get(customerData, "count_distinct_district");
      let sumTopFive = 0;

      (async () => {
        const temp = await Promise.all(
          data.map(async (el) => {
            sumTopFive += el.customers_count;

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
            customers_count: total - sumTopFive,
            province: "Khác",
            district: "Khác",
          });
        }

        setTransformedCustomerData(temp);
      })();
    }
  }, [data, filter.province, customerData]);

  const renderChart = useMemo(() => {
    if (data == undefined || provinceData == undefined || customerData == undefined)
      return null;

    if (!isEmpty(filter.province)) {
      if (transformedCustomerData == undefined) return <Loading />;

      return (
        <ResponsiveContainer width="100%" height="100%" minHeight={400}>
          <PieChart>
            <Pie
              dataKey="customers_count"
              data={transformedCustomerData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              nameKey="district"
              label={(props: LabelProps) => {
                const { x, y, textAnchor } = props;

                const displayDistrict = get(props, "district");
                const countValue = get(props, "customers_count");

                return (
                  <text x={x} y={y} textAnchor={textAnchor} fontSize={12} width={50}>
                    {`${displayDistrict}: ${countValue} `}
                  </text>
                );
              }}
            >
              {transformedCustomerData.map((el, idx) => {
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

    const total = get(customerData, "count_distinct_province");
    let sumTopFive = 0;

    const transformedData = data.map((el) => {
      sumTopFive += el.customers_count;

      return {
        ...el,
        province: getDisplayValueFromChoiceItem(provinceData, el.province),
      };
    });

    if (total - sumTopFive > 0) {
      transformedData.push({
        customers_count: total - sumTopFive,
        province: "Khác",
      });
    }

    return (
      <ResponsiveContainer width={"100%"} height="100%" minHeight={400}>
        <PieChart>
          <Pie
            dataKey="customers_count"
            data={transformedData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            nameKey="province"
            label={(props: LabelProps) => {
              const { x, y, textAnchor } = props;

              const displayProvince = get(props, "province");
              const countValue = get(props, "customers_count");

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
  }, [data, provinceData, filter.province, customerData, transformedCustomerData]);

  if (data == undefined || provinceData == undefined || customerData == undefined) {
    return <Loading />;
  }

  if (isEmpty(data)) {
    return <NoData />;
  }
  return (
    <Stack spacing={2} alignItems="center">
      <Typography variant="body2">
        {"Tổng số khách hàng theo khu vực: "}
        <Typography component={"span"} color="primary2.main" fontWeight="700">
          {!isEmpty(filter.province)
            ? get(customerData, "count_distinct_district")
            : get(customerData, "count_distinct_province")}
        </Typography>
      </Typography>

      <Typography fontWeight="700">Số lượng khách hàng theo khu vực</Typography>

      {renderChart}
    </Stack>
  );
};

export default CustomerReportChartByRegion;
