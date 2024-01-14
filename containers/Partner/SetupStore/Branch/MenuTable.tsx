import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useSortBy, useTable } from "react-table";

import { Box } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

import { CommonTableProps, MERCHANTS_STORES_BRANCHES_PRODUCTS_ITEM } from "interfaces";

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
  TableCellWithFetch,
} from "components";

type MenuTableProps = CommonTableProps<MERCHANTS_STORES_BRANCHES_PRODUCTS_ITEM> &
  Record<string, any>;

export default function MenuTable(props: MenuTableProps) {
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
            CellProps<MERCHANTS_STORES_BRANCHES_PRODUCTS_ITEM, any>
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
            CellProps<MERCHANTS_STORES_BRANCHES_PRODUCTS_ITEM, any>
          >
        ) => {
          const { cell } = props;

          return (
            <WrapperTableCell title={`${cell.value}`}>{cell.value}</WrapperTableCell>
          );
        },
        colSpan: 5,
      },
      {
        Header: "Đơn Giá",
        accessor: "price",
        Cell: (
          props: PropsWithChildren<
            CellProps<MERCHANTS_STORES_BRANCHES_PRODUCTS_ITEM, any>
          >
        ) => {
          const { cell } = props;

          const value = cell.value && parseInt(cell.value);

          if (value) {
            return (
              <WrapperTableCell title={value} display="flex">
                <VNDCurrency value={value} />
              </WrapperTableCell>
            );
          } else {
            return null;
          }
        },
      },
      {
        Header: "Danh Mục",
        accessor: "category",
        Cell: (
          props: PropsWithChildren<
            CellProps<MERCHANTS_STORES_BRANCHES_PRODUCTS_ITEM, any>
          >
        ) => {
          const { cell } = props;

          const value = cell.value;

          return (
            <TableCellWithFetch<any> url={value}>
              {(data) => {
                return (
                  <WrapperTableCell
                    title={`${data.name}`}
                  >{`${data.name}`}</WrapperTableCell>
                );
              }}
            </TableCellWithFetch>
          );
        },
      },
      {
        Header: "Đang Bán",
        accessor: "is_available",
        textAlign: "center",
        maxWidth: 100,

        Cell: (
          props: PropsWithChildren<
            CellProps<MERCHANTS_STORES_BRANCHES_PRODUCTS_ITEM, any>
          >
        ) => {
          const { cell } = props;

          const value = cell.value;

          return (
            <WrapperTableCell display="flex" justifyContent="center">
              <CircleIcon color={value ? "primary2" : "primary"} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Hiển Thị",
        accessor: "is_published",
        textAlign: "center",
        maxWidth: 100,
        Cell: (
          props: PropsWithChildren<
            CellProps<MERCHANTS_STORES_BRANCHES_PRODUCTS_ITEM, any>
          >
        ) => {
          const { cell } = props;

          const value = cell.value;

          return (
            <WrapperTableCell display="flex" justifyContent="center">
              <CircleIcon color={value ? "primary2" : "primary"} />
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
    useSortBy
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
