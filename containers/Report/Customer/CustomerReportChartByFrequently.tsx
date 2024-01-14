import useSWR from "swr";
import React, { memo, useMemo } from "react";

import {
  Area,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  TooltipProps,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { Box, Stack, Typography, useTheme } from "@mui/material";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { Loading, NoData } from "components";
import { IFilterProps } from "./CustomerReport";

import { REPORTS_CUSTOMERS_ORDERS } from "apis";
import { transformDate, transformUrl } from "libs";
import { responseSchema, REPORTS_CUSTOMERS_ORDERS_ITEM } from "interfaces";
import { convertTimeToString, convertUnitToPeriodTime } from "libs/dateUtils";

interface CustomerReportChartByFrequently {
  filter: IFilterProps;
}

const CustomerReportChartByFrequently = (props: CustomerReportChartByFrequently) => {
  const { filter } = props;
  const theme = useTheme();

  const { data } = useSWR<responseSchema<REPORTS_CUSTOMERS_ORDERS_ITEM>>(() => {
    let date_start = transformDate(filter.range.startDate, "date_start");
    let date_end = transformDate(filter.range.endDate, "date_end");

    return transformUrl(REPORTS_CUSTOMERS_ORDERS, {
      date_start,
      date_end,
      period:
        date_end - date_start > 86400
          ? convertUnitToPeriodTime("day")
          : convertUnitToPeriodTime("hour"),
      limit: 1000,
      customer: filter?.customer?.self,
    });
  });

  const renderChart = useMemo(() => {
    if (data == undefined) return null;

    const transformedData = data.results.map((el) => {
      return {
        ...el,
        date_start: convertTimeToString("day", el.date_start),
      };
    });

    return (
      <ResponsiveContainer width={"100%"} height="100%" minHeight={400}>
        <AreaChart
          data={transformedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={theme.palette.primary2.main}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={theme.palette.primary2.main}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis dataKey="date_start" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="orders_count"
            stroke={theme.palette.primary2.main}
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }, [data]);

  const renderTotalOrder = useMemo(() => {
    if (data == undefined) return null;

    const total = data.results.reduce((sum, el) => {
      return (sum += el.orders_count);
    }, 0);

    return (
      <Typography variant="body2">
        {"Tổng đơn hàng: "}
        <Typography component={"span"} color="primary2.main" fontWeight="700">
          {total}
        </Typography>
      </Typography>
    );
  }, [data]);

  if (data == undefined) return <Loading />;

  if (isEmpty(data)) return <NoData />;

  return (
    <Stack spacing={2} alignItems="center">
      {renderTotalOrder}

      <Typography fontWeight="700">Tần suất mua hàng của khách hàng</Typography>

      {renderChart}
    </Stack>
  );
};

const CustomTooltip = memo(function CustomTooltip(props: TooltipProps<any, any>) {
  const { active, payload } = props;

  if (active && !isEmpty(payload)) {
    const dateStart = get(payload, "[0]payload.date_start");
    const value = get(payload, "[0].value");

    return (
      <Box textAlign={"center"}>
        <Typography variant="body2">{`Số lượng đơn hàng ngày ${dateStart}`}</Typography>
        <Typography fontWeight="700" color="primary2.main">
          {`${value} đơn hàng`}
        </Typography>
      </Box>
    );
  }

  return null;
});

export default CustomerReportChartByFrequently;
