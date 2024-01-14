import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useSortBy, useTable } from "react-table";

import { Box } from "@mui/material";

import {
  Table,
  TableBody,
  TableHead,
  RenderBody,
  VNDCurrency,
  RenderHeader,
  TableContainer,
  TablePagination,
  WrapperTableCell,
  TableCellForAvatar,
} from "components";

import { CommonTableProps, MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM } from "interfaces";

type ProductOfPromotionTableProps =
  CommonTableProps<MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM> & Record<string, any>;

export default function ProductOfPromotionTable(props: ProductOfPromotionTableProps) {
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
        Header: "Ảnh Sản Phẩm",
        accessor: "image",
        Cell: (
          props: PropsWithChildren<
            CellProps<MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM, any>
          >
        ) => {
          const { cell } = props;

          const value = cell.value;

          return <TableCellForAvatar src={value} />;
        },
        textAlign: "center",
      },
      {
        Header: "Tên Sản Phẩm",
        accessor: "name",

        Cell: (
          props: PropsWithChildren<
            CellProps<MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM, any>
          >
        ) => {
          const { cell } = props;

          return (
            <WrapperTableCell title={`${cell.value}`}>{cell.value}</WrapperTableCell>
          );
        },
        colSpan: 3,
      },
      {
        Header: "Đơn Giá",
        accessor: "price",
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<
            CellProps<MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM, any>
          >
        ) => {
          const { cell } = props;

          const value = cell.value && parseInt(cell.value);

          if (value == undefined) {
            return null;
          } else {
            return (
              <WrapperTableCell title={value}>
                <VNDCurrency value={value} />
              </WrapperTableCell>
            );
          }
        },
        colSpan: 2,
      },
      {
        Header: "Giá Khuyến Mãi",
        accessor: "discounted_price",
        Cell: (
          props: PropsWithChildren<
            CellProps<MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM, any>
          >
        ) => {
          const { cell } = props;

          const value = cell.value && parseInt(cell.value);

          if (value == undefined) {
            return null;
          } else {
            return (
              <WrapperTableCell title={value}>
                <VNDCurrency value={value} />
              </WrapperTableCell>
            );
          }
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
