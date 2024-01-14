import { useSticky } from "react-table-sticky";
import { CellProps, useSortBy, useTable } from "react-table";
import React, { Fragment, PropsWithChildren, useMemo } from "react";

import { get } from "lodash";
import { Box } from "@mui/material";
import { transformUrl } from "libs";
import { usePermission } from "hooks";

import {
  responseSchema,
  CUSTOMERS_ITEM,
  CommonTableProps,
  CUSTOMERS_WALLETS_ITEM,
  MERCHANTS_STORES_BRANCHES_ORDERS_ITEM,
} from "interfaces";

import {
  Link,
  Table,
  TableBody,
  TableHead,
  RenderBody,
  RenderHeader,
  NumberFormat,
  TableContainer,
  ActionTableCell,
  TablePagination,
  WrapperTableCell,
  TableCellWithFetch,
} from "components";

type CustomerTableProps = CommonTableProps<CUSTOMERS_WALLETS_ITEM> & Record<string, any>;

const CustomerTable = (props: CustomerTableProps) => {
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
        accessor: "owner",
        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_WALLETS_ITEM, any>>) => {
          const { cell, row, column, onGotoHandler } = props;

          const { hasPermission } = usePermission("read_customer");

          const value = cell.value;

          if (!hasPermission) return <WrapperTableCell>-</WrapperTableCell>;

          return (
            <TableCellWithFetch<CUSTOMERS_ITEM> url={value}>
              {(data) => {
                const firstName = get(data, "first_name");
                const lastName = get(data, "last_name");

                const fullName = `${lastName} ${firstName}`;

                return (
                  <WrapperTableCell title={fullName}>
                    <Link href="#" onClick={onGotoHandler?.({ row, column })}>
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
        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_WALLETS_ITEM, any>>) => {
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
        Header: "Tổng Đơn Hàng",
        accessor: "order",
        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_WALLETS_ITEM, any>>) => {
          const { row } = props;

          const owner = get(row, "original.owner");

          return (
            <TableCellWithFetch<CUSTOMERS_ITEM> url={owner}>
              {(data) => {
                const { orders } = data;

                return (
                  <TableCellWithFetch<
                    responseSchema<MERCHANTS_STORES_BRANCHES_ORDERS_ITEM>
                  >
                    url={transformUrl(orders, {
                      with_count: true,
                      limit: 1,
                    })}
                  >
                    {(data) => {
                      if (data.count == undefined) {
                        return <Fragment></Fragment>;
                      }

                      return (
                        <WrapperTableCell
                          title={data.count}
                          justifyContent="flex-end"
                          display="flex"
                        >
                          <NumberFormat value={data.count} />
                        </WrapperTableCell>
                      );
                    }}
                  </TableCellWithFetch>
                );
              }}
            </TableCellWithFetch>
          );
        },
      },

      {
        Header: "Hành động",
        accessor: "",
        sticky: "right",
        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_WALLETS_ITEM, any>>) => {
          const { onViewHandler, column, row } = props;

          return (
            <ActionTableCell onViewHandler={onViewHandler} column={column} row={row} />
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

export default CustomerTable;
