import useSWR from "swr";
import React, { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, LabelProps, Cell } from "recharts";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { Stack, Typography } from "@mui/material";

import { Loading } from "components";
import { IFilterProps } from "./PartnerReportByChart";

import {
  transformUrl,
  transformDate,
  getDisplayValueFromChoiceItem,
  convertValueToTupleForAddress,
} from "libs";

import { CHOICES_DIVISIONS } from "apis";
import { CHART_COLOR_PALETTE } from "constant";
import { ChoiceItem, REPORTS_MERCHANTS_TOP_REGION_BRANCHES_ITEM } from "interfaces";
import { MERCHANTS_STORES_BRANCHES, REPORTS_MERCHANTS_TOP_REGION_BRANCHES } from "apis";

interface BranchChartByRegionProps {
  filter: IFilterProps;
}

const BranchChartByRegion = (props: BranchChartByRegionProps) => {
  const { filter } = props;

  const { data } = useSWR<REPORTS_MERCHANTS_TOP_REGION_BRANCHES_ITEM[]>(() => {
    let province;

    let date_start = transformDate(filter.range.startDate, "date_start");
    let date_end = transformDate(filter.range.endDate, "date_end");

    if (!isEmpty(filter.province)) {
      province = get(filter, "province[0]");
    }

    return transformUrl(REPORTS_MERCHANTS_TOP_REGION_BRANCHES, {
      top_amounts: 5,
      date_start,
      date_end,
      province,
    });
  });

  const { data: merchantStoreBranchData } = useSWR(() => {
    let province;

    let date_start = transformDate(filter.range.startDate, "date_start");
    let date_end = transformDate(filter.range.endDate, "date_end");

    if (!isEmpty(filter.province)) {
      province = get(filter, "province[0]");
    }

    if (province) {
      return transformUrl(MERCHANTS_STORES_BRANCHES, {
        with_count: true,
        date_created_start: date_start,
        date_created_end: date_end,
        limit: 1,
        province,
      });
    }

    return transformUrl(MERCHANTS_STORES_BRANCHES, {
      with_count: true,
      date_created_start: date_start,
      date_created_end: date_end,
      limit: 1,
    });
  });

  const { data: provinceData } = useSWR<ChoiceItem[]>(CHOICES_DIVISIONS);

  const [transformedMerchantBranchData, setTransformedMerchantBranchData] =
    useState<REPORTS_MERCHANTS_TOP_REGION_BRANCHES_ITEM[]>();

  useEffect(() => {
    if (
      !isEmpty(filter.province) &&
      data != undefined &&
      merchantStoreBranchData != undefined
    ) {
      const total = get(merchantStoreBranchData, "count");
      let sumTopFive = 0;

      (async () => {
        const temp = await Promise.all(
          data.map(async (el) => {
            sumTopFive += el.branches_count;

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
            branches_count: total - sumTopFive,
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
    )
      return null;

    if (!isEmpty(filter.province)) {
      if (transformedMerchantBranchData == undefined) return <Loading />;

      return (
        <ResponsiveContainer minHeight={400} width="100%" height="100%">
          <PieChart>
            <Pie
              dataKey="branches_count"
              data={transformedMerchantBranchData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              nameKey="district"
              label={(props: LabelProps) => {
                const { x, y, textAnchor } = props;

                const displayDistrict = get(props, "district");
                const countValue = get(props, "branches_count");

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

    let sumTopFive = 0;

    const transformedData = data.map((el) => {
      sumTopFive += el.branches_count;

      return {
        ...el,
        province: getDisplayValueFromChoiceItem(provinceData, el.province),
      };
    });

    if (get(merchantStoreBranchData, "count") - sumTopFive > 0) {
      transformedData.push({
        province: "Khác",
        branches_count: get(merchantStoreBranchData, "count") - sumTopFive,
      });
    }

    return (
      <ResponsiveContainer width={"100%"} height="100%" minHeight={400}>
        <PieChart>
          <Pie
            dataKey="branches_count"
            data={transformedData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            nameKey="province"
            label={(props: LabelProps) => {
              const { x, y, textAnchor } = props;

              const displayProvince = get(props, "province");
              const countValue = get(props, "branches_count");

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
    merchantStoreBranchData,
    filter.province,
    transformedMerchantBranchData,
  ]);

  if (data == undefined || provinceData == undefined) {
    return <Loading />;
  }

  if (isEmpty(data)) {
    return null;
  }

  return (
    <Stack spacing={2} alignItems="center">
      <Typography variant="body2" alignSelf="flex-start">
        {"Tổng số chi nhánh theo khu vực: "}
        <Typography component={"span"} color="primary2.main" fontWeight="700">
          {get(merchantStoreBranchData, "count")}
        </Typography>
      </Typography>

      <Typography fontWeight="700">Số lượng chi nhánh theo khu vực</Typography>
      {renderChart}
    </Stack>
  );
};

export default BranchChartByRegion;
