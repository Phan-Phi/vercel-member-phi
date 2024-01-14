import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useSortBy, useTable } from "react-table";

import { get } from "lodash";
import { Box } from "@mui/material";

import { useChoice, usePermission } from "hooks";
import { formatDate, getDisplayValueFromChoiceItem } from "libs";
import { CUSTOMERS_TRANSACTIONS_ITEM, CommonTableProps } from "interfaces";

import {
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
} from "components";

type TransactionHistoryTableProps = CommonTableProps<CUSTOMERS_TRANSACTIONS_ITEM> &
  Record<string, any>;

const TransactionHistoryTable = (props: TransactionHistoryTableProps) => {
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
        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_TRANSACTIONS_ITEM, any>>) => {
          const { value } = props;

          if (value == undefined) return null;

          return (
            <WrapperTableCell title={value}>
              <NumberFormat value={value} prefix={value > 0 ? "+" : undefined} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Đối Tượng",
        accessor: "target_name",
        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_TRANSACTIONS_ITEM, any>>) => {
          const { value, onViewMerchantHandler, row, column } = props;

          // const { hasPermission } = usePermission("read_customer");

          // const transaction_type = get(row, "original.transaction_type");

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;

          // if (!CUSTOMER_LINK_WHITE_LIST.includes(transaction_type)) {
          //   return (
          //     <WrapperTableCell loading={loading} title={value}>
          //       {value}
          //     </WrapperTableCell>
          //   );
          // }

          // if (!hasPermission) {
          //   return (
          //     <WrapperTableCell loading={loading} title={value}>
          //       {value}
          //     </WrapperTableCell>
          //   );
          // }

          // return (
          //   <WrapperTableCell title={value} loading={loading}>
          //     <Link
          //       href="/"
          //       onClick={(e) => {
          //         e.preventDefault();
          //         onViewMerchantHandler({
          //           row,
          //           column,
          //         });
          //       }}
          //     >
          //       {value}
          //     </Link>
          //   </WrapperTableCell>
          // );
        },
        colSpan: 2,
      },
      {
        Header: "Loại Giao Dịch",
        accessor: "transaction_type",
        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_TRANSACTIONS_ITEM, any>>) => {
          const { transaction_types } = useChoice();

          const { cell } = props;

          const value = cell.value;

          const displayValue = getDisplayValueFromChoiceItem(transaction_types, value);

          return <WrapperTableCell title={displayValue}>{displayValue}</WrapperTableCell>;
        },
      },
      {
        Header: "Ngày Tạo",
        accessor: "date_created",
        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_TRANSACTIONS_ITEM, any>>) => {
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
        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_TRANSACTIONS_ITEM, any>>) => {
          const { onDeleteHandler, onViewHandler, column, row } = props;

          const { hasPermission } = usePermission("read_order");

          const transactionType = get(row, "original.transaction_type");

          const excludeDisplayList = [
            "Customer_Introduce_Point",
            "Customer_Introduced_Point",
          ];

          if (excludeDisplayList.includes(transactionType)) return null;
          return (
            <ActionTableCell
              onViewHandler={hasPermission ? onViewHandler : undefined}
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

export default TransactionHistoryTable;
