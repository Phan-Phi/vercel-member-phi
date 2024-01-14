import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useSortBy, useTable } from "react-table";

import { get } from "lodash";
import { Box } from "@mui/material";

import { usePermission } from "hooks";
import { formatPhoneNumber } from "libs";
import { CommonTableProps, MERCHANTS_STORES_BRANCHES_CASHIERS_ITEM } from "interfaces";

import {
  Table,
  TableBody,
  RenderBody,
  TableHead,
  RenderHeader,
  TableContainer,
  ActionTableCell,
  TablePagination,
  WrapperTableCell,
} from "components";

type CashierTableProps = CommonTableProps<MERCHANTS_STORES_BRANCHES_CASHIERS_ITEM> &
  Record<string, any>;

export default function CashierTable(props: CashierTableProps) {
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
        Header: "Tên",
        accessor: "name",
        Cell: (
          props: PropsWithChildren<
            CellProps<MERCHANTS_STORES_BRANCHES_CASHIERS_ITEM, any>
          >
        ) => {
          const { row } = props;

          const firstName = get(row, "original.first_name");
          const lastName = get(row, "original.last_name");

          const fullName = `${lastName} ${firstName}`;

          return <WrapperTableCell title={`${fullName}`}>{fullName}</WrapperTableCell>;
        },
        colSpan: 3,
      },

      {
        Header: "Số Điện Thoại",
        accessor: "phone_number",
        Cell: (
          props: PropsWithChildren<
            CellProps<MERCHANTS_STORES_BRANCHES_CASHIERS_ITEM, any>
          >
        ) => {
          const { cell } = props;

          const value = cell.value;

          return (
            <WrapperTableCell title={formatPhoneNumber(value)}>
              {formatPhoneNumber(value)}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Email",
        accessor: "email",

        Cell: (
          props: PropsWithChildren<
            CellProps<MERCHANTS_STORES_BRANCHES_CASHIERS_ITEM, any>
          >
        ) => {
          const { cell } = props;

          const value = cell.value;
          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
        colSpan: 2,
      },
      {
        Header: "Hành Động",
        accessor: "",
        Cell: (
          props: PropsWithChildren<
            CellProps<MERCHANTS_STORES_BRANCHES_CASHIERS_ITEM, any>
          >
        ) => {
          const { onDeleteHandler, onViewHandler, column, row } = props;

          const { hasPermission } = usePermission("write_cashier");

          return (
            <ActionTableCell
              onViewHandler={onViewHandler}
              onDeleteHandler={hasPermission ? onDeleteHandler : undefined}
              column={column}
              row={row}
            />
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
    useSortBy
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
}
