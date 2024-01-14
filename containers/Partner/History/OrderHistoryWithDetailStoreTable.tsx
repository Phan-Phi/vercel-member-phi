import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useSortBy, useTable } from "react-table";

import { Box } from "@mui/material";

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

import { formatDate } from "libs";
import { usePermission } from "hooks";
import { CommonTableProps, MERCHANTS_STORES_BRANCHES_ORDERS_ITEM } from "interfaces";

type OrderHistoryWithDetailStoreTableProps =
  CommonTableProps<MERCHANTS_STORES_BRANCHES_ORDERS_ITEM> & Record<string, any>;

const OrderHistoryWithDetailStoreTable = (
  props: OrderHistoryWithDetailStoreTableProps
) => {
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

          const { hasPermission } = usePermission("read_order");

          const value = cell.value;

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
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_BRANCHES_ORDERS_ITEM, any>>
        ) => {
          const { cell } = props;

          let value = cell.value ? parseInt(cell.value) : 0;

          return (
            <WrapperTableCell title={value}>
              <VNDCurrency value={value} />
            </WrapperTableCell>
          );
        },
        colSpan: 2,
      },
      {
        Header: "Khách Hàng",
        accessor: "customer_name",
        Cell: (
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_BRANCHES_ORDERS_ITEM, any>>
        ) => {
          const { cell, row, onViewCustomerHandler, column } = props;

          const { hasPermission } = usePermission("read_customer");

          const value = cell.value || "-";

          return (
            <WrapperTableCell title={value}>
              {hasPermission ? (
                <Link
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();

                    onViewCustomerHandler({
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

export default OrderHistoryWithDetailStoreTable;
