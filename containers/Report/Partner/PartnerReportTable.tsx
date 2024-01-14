import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useSortBy, useTable } from "react-table";

import { get } from "lodash";
import { Box } from "@mui/material";

import {
  responseSchema,
  CommonTableProps,
  MERCHANTS_STORES_ITEM,
  MERCHANTS_WALLETS_ITEM,
  REPORTS_MERCHANTS_OVEWVIEW_ITEM,
} from "interfaces";

import {
  Table,
  TableBody,
  TableHead,
  RenderBody,
  VNDCurrency,
  NumberFormat,
  RenderHeader,
  TableContainer,
  TablePagination,
  WrapperTableCell,
  TableCellWithFetch,
} from "components";

type PartnerReportTableProps = CommonTableProps<REPORTS_MERCHANTS_OVEWVIEW_ITEM> &
  Record<string, any>;

const PartnerReportTable = (props: PartnerReportTableProps) => {
  const {
    data,
    count,
    onPageChange,
    onPageSizeChange,
    pagination,
    maxHeight,
    isLoading,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    return [
      {
        Header: "Tên Đối Tác",
        accessor: "name",
        Cell: (
          props: PropsWithChildren<CellProps<REPORTS_MERCHANTS_OVEWVIEW_ITEM, any>>
        ) => {
          const { row } = props;

          const firstName = get(row, "original.first_name");
          const lastName = get(row, "original.last_name");

          const fullName = `${lastName} ${firstName}`;

          return (
            <WrapperTableCell
              title={`${fullName}`}
              sx={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {fullName}
            </WrapperTableCell>
          );
        },
        maxWidth: 200,
      },
      {
        Header: "Điểm Hiện Tại",
        accessor: "wallet",
        Cell: (
          props: PropsWithChildren<CellProps<REPORTS_MERCHANTS_OVEWVIEW_ITEM, any>>
        ) => {
          const { cell } = props;

          const url = cell.value;

          return (
            <TableCellWithFetch<responseSchema<MERCHANTS_WALLETS_ITEM>> url={url}>
              {(data) => {
                const pointIn: number = get(data, "results[0].point_in");
                const pointOut: number = get(data, "results[0].point_out");

                return (
                  <WrapperTableCell>
                    <NumberFormat value={pointIn - pointOut} />
                  </WrapperTableCell>
                );
              }}
            </TableCellWithFetch>
          );
        },
      },
      {
        Header: "Tên Quán",
        accessor: "stores",
        Cell: (
          props: PropsWithChildren<CellProps<REPORTS_MERCHANTS_OVEWVIEW_ITEM, any>>
        ) => {
          const { cell } = props;

          const value = cell.value;

          return (
            <TableCellWithFetch<responseSchema<MERCHANTS_STORES_ITEM>> url={value}>
              {(data) => {
                const name = get(data, "results[0].name");

                return <WrapperTableCell title={name}>{name}</WrapperTableCell>;
              }}
            </TableCellWithFetch>
          );
        },
      },
      {
        Header: "Tổng đơn hàng",
        accessor: "total_order_count",
        Cell: (
          props: PropsWithChildren<CellProps<REPORTS_MERCHANTS_OVEWVIEW_ITEM, any>>
        ) => {
          const { cell } = props;
          const value = cell.value || 0;

          return (
            <WrapperTableCell title={value}>
              <NumberFormat value={value} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Tổng giá trị đơn hàng",
        accessor: "total_order_cash",
        Cell: (
          props: PropsWithChildren<CellProps<REPORTS_MERCHANTS_OVEWVIEW_ITEM, any>>
        ) => {
          const { cell } = props;
          const value = cell.value || "0";

          return (
            <WrapperTableCell title={value}>
              <VNDCurrency value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
    ];
  }, []);

  const table = useTable(
    {
      columns: columns as any,
      data,
      manualPagination: true,
      autoResetPage: false,
      ...restProps,
    },
    useSortBy,
    useSticky
  );

  return (
    <Box>
      <TableContainer maxHeight={maxHeight}>
        <Table>
          <TableHead>
            <RenderHeader table={table} />
          </TableHead>
          <TableBody>
            <RenderBody loading={isLoading} table={table} />
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end">
        <TablePagination
          count={count}
          page={pagination.pageIndex}
          rowsPerPage={pagination.pageSize}
          onPageChange={(_, page) => onPageChange(page)}
          onRowsPerPageChange={onPageSizeChange}
          rowsPerPageOptions={[25, 50, 75, 100]}
        />
      </Box>
    </Box>
  );
};

export default PartnerReportTable;
