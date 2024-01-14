import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useSortBy, useTable } from "react-table";

import { Box } from "@mui/material";

import { formatDate } from "libs";
import { usePermission } from "hooks";
import { MERCHANTS_STORES_BRANCHES_ORDERS_ITEM, CommonTableProps } from "interfaces";

import {
  Link,
  Table,
  TableBody,
  TableHead,
  RenderBody,
  VNDCurrency,
  RenderHeader,
  TableContainer,
  TablePagination,
  WrapperTableCell,
} from "components";

type OrderHistoryTableProps = CommonTableProps<MERCHANTS_STORES_BRANCHES_ORDERS_ITEM> &
  Record<string, any>;

const OrderHistoryTable = (props: OrderHistoryTableProps) => {
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
        Header: "Mã Đơn Hàng",
        accessor: "sid",
        Cell: (
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_BRANCHES_ORDERS_ITEM, any>>
        ) => {
          const { cell, onViewHandler, row, column } = props;

          const value = cell.value;

          const { hasPermission } = usePermission("read_order");

          return (
            <WrapperTableCell title={value}>
              {hasPermission ? (
                <Link
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    onViewHandler({
                      row,
                      column,
                    });
                  }}
                >
                  {value}
                </Link>
              ) : (
                value
              )}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Giá Trị",
        accessor: "total_cash",
        Cell: (
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_BRANCHES_ORDERS_ITEM, any>>
        ) => {
          const { cell } = props;

          let value = cell.value;

          return (
            <WrapperTableCell title={parseInt(value)}>
              <VNDCurrency value={parseInt(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Tên Quán",
        accessor: "store_name",
        Cell: (
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_BRANCHES_ORDERS_ITEM, any>>
        ) => {
          const { cell, row, onGotoHandler, column } = props;

          const value = cell.value;

          return (
            <WrapperTableCell title={value}>
              {value}

              {/* <Link href="#" onClick={onGotoHandler?.({ row, column })}>
                {value}
              </Link> */}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Chi Nhánh",
        accessor: "branch_name",
        Cell: (
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_BRANCHES_ORDERS_ITEM, any>>
        ) => {
          const { cell } = props;

          const value = cell.value;

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
      },
      {
        Header: "Ngày Tạo",
        accessor: "date_placed",
        Cell: (
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_BRANCHES_ORDERS_ITEM, any>>
        ) => {
          const { cell } = props;

          const value = cell.value;

          return (
            <WrapperTableCell title={formatDate(value)}>
              {formatDate(value)}
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

export default OrderHistoryTable;
