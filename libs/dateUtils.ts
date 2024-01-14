import {
  millisecondsToSeconds,
  differenceInDays,
  startOfYesterday,
  endOfYesterday,
  startOfMonth,
  startOfWeek,
  endOfToday,
  endOfWeek,
  startOfDay,
  endOfMonth,
  parseISO,
  endOfDay,
  getTime,
  subDays,
  getDay,
  format,
} from "date-fns";

export type ConvertTimeFrameType =
  | "today"
  | "yesterday"
  | "this_month"
  | "last_seven_days"
  | "last_month"
  | "this_week"
  | "month";

export const getUnitFromTimeFrame = (
  type: ConvertTimeFrameType
): ConvertPeriodTimeType => {
  let value: ConvertPeriodTimeType = "day";

  switch (type) {
    case "today":
      value = "hour";
      break;
    case "yesterday":
      value = "hour";
      break;
    case "this_month":
      value = "day";
      break;
    case "last_month":
      value = "day";
      break;
    case "last_seven_days":
      value = "day";
      break;
    case "this_week":
      value = "day";
      break;
    case "month":
      value = "month";
      break;
  }

  return value;
};

export const convertTimeFrameToTimeObject = (type: ConvertTimeFrameType) => {
  const currentYear = new Date().getFullYear();
  let lastYear: number;
  const currentMonth = new Date().getMonth();

  let lastMonth: number;

  if (currentMonth === 0) {
    lastMonth = 11;
    lastYear = currentYear - 1;
  } else {
    lastMonth = currentMonth - 1;
    lastYear = currentYear;
  }

  let dateStart: number = 0;
  let dateEnd: number = 0;

  switch (type) {
    case "today":
      dateStart = millisecondsToSeconds(getTime(startOfDay(Date.now())));
      dateEnd = millisecondsToSeconds(getTime(endOfDay(Date.now())));
      break;
    case "yesterday":
      dateStart = millisecondsToSeconds(getTime(startOfYesterday()));
      dateEnd = millisecondsToSeconds(getTime(endOfYesterday()));
      break;
    case "this_month":
      dateStart = millisecondsToSeconds(getTime(startOfMonth(new Date())));
      dateEnd = millisecondsToSeconds(getTime(endOfMonth(new Date())));
      break;
    case "last_seven_days":
      dateStart = millisecondsToSeconds(getTime(startOfDay(subDays(Date.now(), 6))));
      dateEnd = millisecondsToSeconds(getTime(endOfToday()));
      break;
    case "last_month":
      dateStart = millisecondsToSeconds(
        getTime(startOfMonth(new Date(lastYear, lastMonth, 1, 0, 0, 0)))
      );
      dateEnd = millisecondsToSeconds(
        getTime(endOfMonth(new Date(lastYear, lastMonth, 1, 0, 0, 0)))
      );
      break;
    case "this_week":
      dateStart = millisecondsToSeconds(
        getTime(
          startOfWeek(Date.now(), {
            weekStartsOn: 1,
          })
        )
      );
      dateEnd = millisecondsToSeconds(
        getTime(
          endOfWeek(Date.now(), {
            weekStartsOn: 1,
          })
        )
      );
      break;
  }

  return {
    date_start: dateStart,
    date_end: dateEnd,
  };
};

export type ConvertPeriodTimeType =
  | "hour"
  | "day"
  | "month"
  | "week"
  | "quarter"
  | "year";

export const convertUnitToPeriodTime = (type: ConvertPeriodTimeType) => {
  let value = 3600;

  switch (type) {
    case "hour":
      value = 3600;
      break;
    case "day":
      value = 3600 * 24;
      break;
    case "week":
      value = 3600 * 24 * 7;
      break;
    case "month":
      value = 3600 * 24 * 31;
      break;
    case "quarter":
      value = 3600 * 24 * 31 * 3;
      break;
    case "year":
      value = 3600 * 24 * 365;
      break;
  }

  return value;
};

export const getPeriodFromTimeFrame = (type: ConvertTimeFrameType) => {
  let value = 3600;

  switch (type) {
    case "today":
      value = 3600;
      break;
    case "yesterday":
      value = 3600;
      break;
    case "this_week":
      value = 3600 * 24;
      break;
    case "last_seven_days":
      value = 3600 * 24;
      break;
    case "last_month":
      value = 3600 * 24;
      break;
    case "this_month":
      value = 3600 * 24;
      break;
    case "month":
      value = 3600 * 24 * 31;
      break;
  }

  return value;
};

export const convertTimeToString = (type: ConvertPeriodTimeType, rawValue: string) => {
  let value = parseISO(rawValue);

  let result: string = "";

  switch (type) {
    case "day":
      result = format(value, "dd/MM");
      break;
    case "hour":
      result = format(value, "HH:mm");
      break;
    case "week":
      result = getDay(value).toString();
      break;
    case "month":
      result = format(value, "MM");
      break;
    case "quarter":
      result = format(value, "QQQ");
      break;
    case "year":
      result = format(value, "yyyy");
      break;
  }

  return result;
};

export const convertWeekOfDays = (type: string) => {
  let value: undefined | { id: string; defaultMessage: string };

  switch (type) {
    case "0":
      value = { id: "sunday", defaultMessage: "Chủ nhật" };
      break;
    case "1":
      value = { id: "monday", defaultMessage: "Thứ hai" };

      break;
    case "2":
      value = { id: "tuesday", defaultMessage: "Thứ ba" };

      break;
    case "3":
      value = { id: "wednesday", defaultMessage: "Thứ tư" };

      break;
    case "4":
      value = { id: "thursday", defaultMessage: "Thứ năm" };

      break;
    case "5":
      value = { id: "friday", defaultMessage: "Thứ sáu" };

      break;
    case "6":
      value = { id: "saturday", defaultMessage: "Thứ bảy" };
      break;
  }

  return value;
};

export const convertChartNum = (
  timeFrame: ConvertTimeFrameType,
  type: ConvertPeriodTimeType
) => {
  if (type === "day") {
    const date = convertTimeFrameToTimeObject(timeFrame);
    const dateStart = date.date_start * 1000;
    const dateEnd = date.date_end * 1000;
    return differenceInDays(dateEnd, dateStart) + 1 || 1;
  } else if (type === "hour") {
    return 24;
  } else if (type === "week") {
    return 7;
  }
};
