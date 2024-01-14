import { set } from "lodash";
import { isPossiblePhoneNumber } from "react-phone-number-input";

const BOOLEAN_KEY_LIST = [
  "is_active",
  "signature",
  "is_confirmed",
  "is_published",
  "flow_type",
  "status",
  "transaction_type",
  "app_type_contain",
  "position_contain",
  "app_type",
  "group",
  "range",
  "timeFrame",
  "province",
  "customer",
  "first_store",
  "store",
  "deprecated",
  "appPlatform",
];

const DATE_KEY_LIST = [
  "date_created_start",
  "date_created_end",
  "date_joined_start",
  "date_joined_end",
  "date_placed_start",
  "date_placed_end",
  "date_start",
  "date_end",
];

export function setFilterValue<T extends Record<string, any>>(
  filter: T,
  key: string,
  value: any
) {
  if (key === "page") {
    set(filter, "offset", value * filter.limit);
  } else if (key === "pageSize") {
    set(filter, "limit", value.target.value);
  } else if (key === "page2") {
    set(filter, "page2", value + 1);
  } else if (key === "perPage") {
    set(filter, "perPage", value.target.value);
  } else if (key === "search") {
    if (value && isPossiblePhoneNumber(value.toString(), "VN")) {
      set(filter, "search", parseInt(value.toString().replaceAll(" ", "")));
    } else {
      set(filter, "search", value);
    }
  } else if (key === "action") {
    set(filter, "action", value.target.value);
  } else if (DATE_KEY_LIST.includes(key)) {
    set(filter, key, value);
  } else if (BOOLEAN_KEY_LIST.includes(key)) {
    set(filter, key, value);
  }

  if (key === "page") return filter;

  set(filter, "offset", 0);

  return filter;
}
