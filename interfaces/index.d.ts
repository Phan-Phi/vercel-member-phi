import { TablePaginationProps } from "@mui/material";
import { Range } from "react-date-range";
import { Column, ColumnInstance, Row } from "react-table";

export type ChoiceItem = [string, string];

const ChoiceKey = [
  "transaction_type",
  "transaction_source_type",
  "position",
  "advertisement_body_type",
  "app_type",
  "notification_body_type",
  "notification_type",
  "genders",
  "positions",
  "point_note_statuses",
  "point_note_flow_types",
  "transaction_types",
  "weekdays",
  "modifier_input_types",
  "discount_types",
  "order_status",
  "notification_types",
  "notification_body_types",
  "promotion_notification_target_types",
  "pending_image_signature",
  "pending_image_source_type",
  "push_time_job_statuses",
  "transaction_target_types",
  "auditlog_actions",
  "auditlog_source_types",
  "export_file_extensions",
  "export_customer_overview_fields",
  "export_merchant_overview_fields",
  "export_file_types",
] as const;

export type ChoiceType = {
  [key in (typeof ChoiceKey)[number]]: ChoiceItem[];
};

export type ProvinceTuple = ChoiceItem;
export type DistrictTuple = ChoiceItem;
export type WardTuple = ChoiceItem;

export * from "./responseSchema";
export * from "./UseFetch";

export interface CommonTableProps<T> {
  data: T[];
  count: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: TablePaginationProps["onRowsPerPageChange"];
  pagination: {
    pageSize: number;
    pageIndex: number;
  };
  isLoading?: boolean;
  maxHeight?: number;
}

export interface CommonFilterTableProps<T> {
  filter: T;
  resetFilter: () => void;
  onDateStartChange?: (value: any) => void;
  onDateEndChange?: (value: any) => void;
  onFilterByTime?: () => void;
  onDateRangeChange?: (range: Range) => void;
}

export interface ActionTableProps<T extends Record<string, any>> {
  row: Row<T>;
  column: ColumnInstance<T>;
}
