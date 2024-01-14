import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useSortBy, useTable } from "react-table";

import { Box } from "@mui/material";

import { formatDate, formatPhoneNumber } from "libs";
import { CommonTableProps, MERCHANTS_STORES_BRANCHES_ITEM } from "interfaces";

import {
  Table,
  TableHead,
  TableBody,
  RenderBody,
  RenderHeader,
  TableContainer,
  ActionTableCell,
  TablePagination,
  WrapperTableCell,
  TableCellWithFullAddress,
} from "components";

type BranchTableProps = CommonTableProps<MERCHANTS_STORES_BRANCHES_ITEM> &
  Record<string, any>;

export default function BranchTable(props: BranchTableProps) {
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
        Header: "Tên Chi Nhánh",
        accessor: "name",
        Cell: (
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_BRANCHES_ITEM, any>>
        ) => {
          const { cell } = props;

          return (
            <WrapperTableCell title={`${cell.value}`} maxWidth={150}>
              {cell.value}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Địa chỉ",
        accessor: "address",
        colSpan: 3,
        maxWidth: 250,
        Cell: (
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_BRANCHES_ITEM, any>>
        ) => {
          const { row } = props;

          return <TableCellWithFullAddress data={row.original} />;
        },
      },
      {
        Header: "Số Điện Thoại",
        accessor: "phone_number",
        Cell: (
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_BRANCHES_ITEM, any>>
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
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_BRANCHES_ITEM, any>>
        ) => {
          const { cell } = props;

          const value = cell.value || "-";

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
      },

      {
        Header: "Ngày Tạo",
        accessor: "date_created",
        Cell: (
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_BRANCHES_ITEM, any>>
        ) => {
          const { cell } = props;

          const value = cell.value;

          return (
            <WrapperTableCell title={formatDate(value)}>
              {formatDate(value)}
            </WrapperTableCell>
          );
        },
        maxWidth: 120,
      },
      {
        Header: "Hành Động",
        accessor: "",
        sticky: "right",
        Cell: (
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_BRANCHES_ITEM, any>>
        ) => {
          const { onDeleteHandler, onViewHandler, column, row } = props;

          return (
            <ActionTableCell
              onViewHandler={onViewHandler}
              onDeleteHandler={onDeleteHandler}
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
}
