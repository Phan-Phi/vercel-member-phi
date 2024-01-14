import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useSortBy, useTable } from "react-table";

import { get } from "lodash";
import { Box } from "@mui/material";

import { useChoice, usePermission } from "hooks";
import { formatDate, getDisplayValueFromChoiceItem } from "libs";
import { CommonTableProps, MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM } from "interfaces";

import {
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
} from "components";

type PromotionTableProps = CommonTableProps<MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM> &
  Record<string, any>;

export default function PromotionTable(props: PromotionTableProps) {
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
        Header: "Tên Chương Trình",
        accessor: "name",
        Cell: (
          props: PropsWithChildren<
            CellProps<MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM, any>
          >
        ) => {
          const { cell } = props;

          const value = cell.value;

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
        textAlign: "center",
        maxWidth: 300,
      },
      {
        Header: "Loại Khuyến Mãi",
        accessor: "discount_type",

        Cell: (
          props: PropsWithChildren<
            CellProps<MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM, any>
          >
        ) => {
          const { cell } = props;

          const { discount_types } = useChoice();

          const value = cell.value;

          const displayValue = getDisplayValueFromChoiceItem(discount_types, value);

          return <WrapperTableCell title={displayValue}>{displayValue}</WrapperTableCell>;
        },
        colSpan: 2,
      },
      {
        Header: "Giảm Giá",
        accessor: "discount_amount",
        Cell: (
          props: PropsWithChildren<
            CellProps<MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM, any>
          >
        ) => {
          const { cell, row } = props;

          const value = cell.value && parseInt(cell.value);

          const discountType = get(row, "original.discount_type");

          if (value) {
            return (
              <WrapperTableCell title={value} display="flex">
                <NumberFormat
                  value={value}
                  suffix={discountType === "Fixed" ? " ₫" : "%"}
                />
              </WrapperTableCell>
            );
          } else {
            return null;
          }
        },
      },
      {
        Header: "Điểm Ưu Tiên",
        accessor: "priority",
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<
            CellProps<MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM, any>
          >
        ) => {
          const { cell } = props;

          const value = cell.value;

          return <WrapperTableCell title={`${value}`}>{value}</WrapperTableCell>;
        },
      },
      {
        Header: "Thời Gian Bắt Đầu",
        accessor: "date_start",
        Cell: (
          props: PropsWithChildren<
            CellProps<MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM, any>
          >
        ) => {
          const { cell } = props;

          const value = cell.value;

          return (
            <WrapperTableCell title={`${formatDate(value)}`}>
              {formatDate(value)}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Thời Gian Kết Thúc",
        accessor: "date_end",
        Cell: (
          props: PropsWithChildren<
            CellProps<MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM, any>
          >
        ) => {
          const { cell } = props;

          const value = cell.value;

          return (
            <WrapperTableCell title={`${formatDate(value)}`}>
              {value ? formatDate(value) : "-"}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Hành Động",
        accessor: "",
        sticky: "right",
        Cell: (
          props: PropsWithChildren<
            CellProps<MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM, any>
          >
        ) => {
          const { onDeleteHandler, onViewHandler, column, row } = props;

          const { hasPermission } = usePermission("read_product");

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
