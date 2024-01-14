import { useSticky } from "react-table-sticky";
import { CellProps, useSortBy, useTable } from "react-table";
import React, { Fragment, PropsWithChildren, useMemo } from "react";

import { get } from "lodash";
import { Box } from "@mui/material";

import {
  responseSchema,
  CommonTableProps,
  MERCHANTS_STORES_ITEM,
  MERCHANTS_STORES_BRANCHES_ORDERS_ITEM,
} from "interfaces";

import { transformUrl } from "libs";
import { usePermission } from "hooks";
import { MERCHANTS_STORES_BRANCHES_ORDERS } from "apis";

import {
  Link,
  Table,
  TableHead,
  TableBody,
  RenderBody,
  RenderHeader,
  NumberFormat,
  ActionTableCell,
  TableContainer,
  TablePagination,
  WrapperTableCell,
  TableCellWithFetch,
} from "components";

type TabOrderHistoryTableProps = CommonTableProps<MERCHANTS_STORES_ITEM> &
  Record<string, any>;

const TabOrderHistoryTable = (props: TabOrderHistoryTableProps) => {
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
        Header: "Tên Quán",
        accessor: "name",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_STORES_ITEM, any>>) => {
          const { cell, onGotoHandler, row, column } = props;
          const value = cell.value;

          const { hasPermission } = usePermission("read_merchant");

          return (
            <WrapperTableCell title={value} maxWidth={250}>
              {hasPermission ? (
                <Link href={"#"} onClick={onGotoHandler({ row, column })}>
                  {value}
                </Link>
              ) : (
                value
              )}
            </WrapperTableCell>
          );
        },
        colSpan: 4,
      },
      {
        Header: "Tổng Đơn Hàng",
        accessor: "order",
        textAlign: "right",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_STORES_ITEM, any>>) => {
          const { row } = props;

          const self = get(row, "original.self");

          if (self == undefined) return null;

          return (
            <TableCellWithFetch<responseSchema<MERCHANTS_STORES_BRANCHES_ORDERS_ITEM>>
              url={transformUrl(MERCHANTS_STORES_BRANCHES_ORDERS, {
                store: self,
                with_count: true,
                limit: 1,
              })}
            >
              {(data) => {
                const count = data.count;

                if (count == undefined) return <Fragment />;

                return (
                  <WrapperTableCell
                    title={count}
                    display="flex"
                    justifyContent="flex-end"
                  >
                    <NumberFormat value={count} />
                  </WrapperTableCell>
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
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_STORES_ITEM, any>>) => {
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

export default TabOrderHistoryTable;
