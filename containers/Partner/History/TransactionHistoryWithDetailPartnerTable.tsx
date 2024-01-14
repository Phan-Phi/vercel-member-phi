import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useSortBy, useTable } from "react-table";

import { get } from "lodash";
import { Box } from "@mui/material";

import { useChoice, usePermission } from "hooks";
import { CUSTOMER_LINK_WHITE_LIST } from "constant";
import { formatDate, getDisplayValueFromChoiceItem } from "libs";
import { MERCHANTS_TRANSACTIONS_ITEM, CommonTableProps } from "interfaces";

import {
  ActionTableCell,
  Link,
  NumberFormat,
  RenderBody,
  RenderHeader,
  Table,
  TableBody,
  TableCellWithFetch,
  TableContainer,
  TableHead,
  TablePagination,
  WrapperTableCell,
} from "components";

type TransactionHistoryWithDetailPartnerTableProps =
  CommonTableProps<MERCHANTS_TRANSACTIONS_ITEM> & Record<string, any>;

const TransactionHistoryWithDetailPartnerTable = (
  props: TransactionHistoryWithDetailPartnerTableProps
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
        Header: "Số Điểm",
        accessor: "directed_transaction_amount",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_TRANSACTIONS_ITEM, any>>) => {
          const { cell } = props;

          const value = cell.value;

          if (value && value.toString()) {
            return (
              <WrapperTableCell title={value}>
                <NumberFormat value={value} prefix={value > 0 ? "+" : undefined} />
              </WrapperTableCell>
            );
          } else {
            return null;
          }
        },
      },
      {
        Header: "Đối Tượng",
        accessor: "target_name",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_TRANSACTIONS_ITEM, any>>) => {
          const { hasPermission } = usePermission("read_customer");

          const { cell, row, onGotoHandler } = props;

          const value = cell.value;

          const source = get(row, "original.source");
          const source_type = get(row, "original.source_type");
          const transaction_type = get(row, "original.transaction_type");

          if (!CUSTOMER_LINK_WHITE_LIST.includes(transaction_type)) {
            return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
          }

          if (!hasPermission) {
            return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
          }

          return (
            <TableCellWithFetch url={source}>
              {(data) => {
                return (
                  <WrapperTableCell title={value}>
                    <Link
                      href={"#"}
                      onClick={onGotoHandler?.({ ...data, source_type: source_type })}
                    >
                      {value}
                    </Link>
                  </WrapperTableCell>
                );
              }}
            </TableCellWithFetch>
          );
        },
        colSpan: 2,
      },

      {
        Header: "Order",
        accessor: "order",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_TRANSACTIONS_ITEM, any>>) => {
          const { cell, row, onGotoHandler } = props;

          const source = get(row, "original.source");
          // console.log("🚀 ~ columns ~ source:", source);

          // return (
          //   <TableCellWithFetch url={source}>
          //     {(data) => {
          //       if (data == undefined) {
          //         return <WrapperTableCell>-</WrapperTableCell>;
          //       }
          //       return <WrapperTableCell>{data.cashier_name}</WrapperTableCell>;
          //     }}
          //   </TableCellWithFetch>
          // );

          return <WrapperTableCell>-</WrapperTableCell>;
        },
        colSpan: 2,
      },
      {
        Header: "Chi Nhánh",
        accessor: "transaction_types",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_TRANSACTIONS_ITEM, any>>) => {
          const { transaction_type } = useChoice();
          const { cell, row } = props;

          const value = cell.value;
          const sourceType = get(row, "original.source_type");

          const displayValue = getDisplayValueFromChoiceItem(transaction_type, value);

          return <WrapperTableCell title={sourceType}>{sourceType}</WrapperTableCell>;
        },
      },
      {
        Header: "Loại Giao Dịch",
        accessor: "transaction_type",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_TRANSACTIONS_ITEM, any>>) => {
          const { transaction_type } = useChoice();
          const { cell } = props;

          const value = cell.value;

          const displayValue = getDisplayValueFromChoiceItem(transaction_type, value);

          if (displayValue) {
            return (
              <WrapperTableCell title={displayValue}>
                <NumberFormat value={displayValue} />
              </WrapperTableCell>
            );
          } else {
            return null;
          }
        },
      },
      {
        Header: "Ngày Tạo",
        accessor: "date_created",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_TRANSACTIONS_ITEM, any>>) => {
          const { cell } = props;

          const value = cell.value;

          return (
            <WrapperTableCell title={formatDate(value)}>
              {formatDate(value)}
            </WrapperTableCell>
          );
        },
      },

      {
        Header: "Hành động",
        accessor: "",
        sticky: "right",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_TRANSACTIONS_ITEM, any>>) => {
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

export default TransactionHistoryWithDetailPartnerTable;
