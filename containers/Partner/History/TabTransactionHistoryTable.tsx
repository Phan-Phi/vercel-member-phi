import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useSortBy, useTable } from "react-table";

import { get } from "lodash";
import { Box } from "@mui/material";

import { usePermission } from "hooks";
import { CommonTableProps, MERCHANTS_WALLETS_ITEM } from "interfaces";

import {
  Link,
  Table,
  TableBody,
  TableHead,
  RenderBody,
  NumberFormat,
  RenderHeader,
  TableContainer,
  ActionTableCell,
  TablePagination,
  WrapperTableCell,
  TableCellWithFetch,
} from "components";

type TabTransactionHistoryTableProps = CommonTableProps<MERCHANTS_WALLETS_ITEM> &
  Record<string, any>;

const TabTransactionHistoryTable = (props: TabTransactionHistoryTableProps) => {
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
        accessor: "owner",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_WALLETS_ITEM, any>>) => {
          const { cell, onGotoHandler, column } = props;
          const value = cell.value;

          const { hasPermission } = usePermission("read_merchant");

          if (!hasPermission)
            return <WrapperTableCell maxWidth={250}>-</WrapperTableCell>;

          return (
            <TableCellWithFetch<MERCHANTS_WALLETS_ITEM> url={value}>
              {(data) => {
                const firstName = get(data, "first_name");
                const lastName = get(data, "last_name");
                const fullName = `${lastName} ${firstName}`;

                return (
                  <WrapperTableCell title={fullName} maxWidth={250}>
                    <Link href="#" onClick={onGotoHandler?.({ row: data, column })}>
                      {fullName}
                    </Link>
                  </WrapperTableCell>
                );
              }}
            </TableCellWithFetch>
          );
        },
        colSpan: 4,
      },

      {
        Header: "Điểm Hiện Tại",
        accessor: "point",
        textAlign: "right",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_WALLETS_ITEM, any>>) => {
          const { row } = props;

          const pointIn = get(row, "original.point_in");
          const pointOut = get(row, "original.point_out");

          const point = pointIn - pointOut;

          return (
            <WrapperTableCell title={point}>
              <NumberFormat value={point} />
            </WrapperTableCell>
          );
        },
      },

      {
        Header: "Hành động",
        accessor: "",
        sticky: "right",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_WALLETS_ITEM, any>>) => {
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
};

export default TabTransactionHistoryTable;
