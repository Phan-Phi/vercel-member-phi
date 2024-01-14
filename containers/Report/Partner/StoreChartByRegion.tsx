import React, { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, LabelProps, Cell } from "recharts";

import useSWR from "swr";
import { get, isEmpty } from "lodash";
import { Stack, Typography } from "@mui/material";

import { Loading, NoData } from "components";
import { IFilterProps } from "./PartnerReportByChart";

import {
  transformUrl,
  transformDate,
  getDisplayValueFromChoiceItem,
  convertValueToTupleForAddress,
} from "libs";

import { CHOICES_DIVISIONS } from "apis";
import { CHART_COLOR_PALETTE } from "constant";
import { REPORTS_MERCHANTS_TOP_REGION_STORES_ITEM, ChoiceItem } from "interfaces";
import { REPORTS_MERCHANTS_TOP_REGION_STORES, MERCHANTS_STORES_BRANCHES } from "apis";

interface StoreChartByRegionProps {
  filter: IFilterProps;
}

const StoreChartByRegion = (props: StoreChartByRegionProps) => {
  const { filter } = props;

  const { data } = useSWR<REPORTS_MERCHANTS_TOP_REGION_STORES_ITEM[]>(() => {
    let province;

    let date_start = transformDate(filter.range.startDate, "date_start");
    let date_end = transformDate(filter.range.endDate, "date_end");

    if (!isEmpty(filter.province)) {
      province = get(filter, "province[0]");
    }

    return transformUrl(REPORTS_MERCHANTS_TOP_REGION_STORES, {
      top_amounts: 5,
      date_start,
      date_end,
      province,
    });
  });

  const { data: provinceData } = useSWR<ChoiceItem[]>(CHOICES_DIVISIONS);

  const { data: merchantStoreBranchData } = useSWR(() => {
    let province;

    let date_start = transformDate(filter.range.startDate, "date_start");
    let date_end = transformDate(filter.range.endDate, "date_end");

    if (!isEmpty(filter.province)) {
      province = get(filter, "province[0]");
    }

    if (province) {
      return transformUrl(MERCHANTS_STORES_BRANCHES, {
        with_count_distinct_district: true,
        store_date_created_start: date_start,
        store_date_created_end: date_end,
        limit: 1,
        province,
      });
    }

    return transformUrl(MERCHANTS_STORES_BRANCHES, {
      with_count_distinct_province: true,
      store_date_created_start: date_start,
      store_date_created_end: date_end,
      limit: 1,
    });
  });

  const [transformedMerchantBranchData, setTransformedMerchantBranchData] =
    useState<REPORTS_MERCHANTS_TOP_REGION_STORES_ITEM[]>();

  useEffect(() => {
    if (
      !isEmpty(filter.province) &&
      data != undefined &&
      merchantStoreBranchData != undefined
    ) {
      const total = get(merchantStoreBranchData, "count_distinct_district");

      let sumTopFive = 0;

      (async () => {
        const temp = await Promise.all(
          data.map(async (el) => {
            sumTopFive += el.stores_count;

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
            stores_count: total - sumTopFive,
            province: "Khác",
            district: "Khác",
          });
        }

        setTransformedMerchantBranchData(temp);
      })();
    }
  }, [data, filter.province, merchantStoreBranchData]);

  const renderChart = useMemo(() => {
    if (
      data == undefined ||
      provinceData == undefined ||
      merchantStoreBranchData == undefined
    ) {
      return null;
    }

    if (!isEmpty(filter.province)) {
      if (transformedMerchantBranchData == undefined) {
        return <Loading />;
      }

      return (
        <ResponsiveContainer minHeight={400} width="100%" height="100%">
          <PieChart>
            <Pie
              dataKey="stores_count"
              data={transformedMerchantBranchData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              nameKey="district"
              label={(props: LabelProps) => {
                const { x, y, textAnchor } = props;

                const displayDistrict = get(props, "district");
                const countValue = get(props, "stores_count");
                return (
                  <text x={x} y={y} textAnchor={textAnchor} fontSize={12}>
                    {`${displayDistrict}: ${countValue} `}
                  </text>
                );
              }}
            >
              {transformedMerchantBranchData.map((el, idx) => {
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

    const total = get(merchantStoreBranchData, "count_distinct_province");

    let sumTopFive = 0;

    const transformedData = data.map((el) => {
      sumTopFive += el.stores_count;

      return {
        ...el,
        province: getDisplayValueFromChoiceItem(provinceData, el.province),
      };
    });

    if (total - sumTopFive > 0) {
      transformedData.push({
        stores_count: total - sumTopFive,
        province: "Khác",
      });
    }

    return (
      <ResponsiveContainer minHeight={400} width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="stores_count"
            data={transformedData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            nameKey="province"
            label={(props: LabelProps) => {
              const { x, y, textAnchor } = props;

              const displayProvince = get(props, "province");
              const countValue = get(props, "stores_count");
              return (
                <text x={x} y={y} textAnchor={textAnchor} fontSize={12}>
                  {`${displayProvince}: ${countValue}`}
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
  }, [
    data,
    provinceData,
    filter.province,
    transformedMerchantBranchData,
    merchantStoreBranchData,
  ]);

  if (data == undefined || provinceData == undefined) {
    return <Loading />;
  }

  if (isEmpty(data)) {
    return <NoData />;
  }

  return (
    <Stack spacing={2}>
      <Typography variant="body2">
        {"Tổng số quán theo khu vực: "}
        <Typography component={"span"} color="primary2.main" fontWeight="700">
          {get(filter, "province")
            ? get(merchantStoreBranchData, "count_distinct_district")
            : get(merchantStoreBranchData, "count_distinct_province")}
        </Typography>
      </Typography>

      {/* <Typography fontWeight="700">Số lượng quán theo khu vực</Typography> */}

      {/* {renderChart} */}
    </Stack>
  );
};

export default StoreChartByRegion;
