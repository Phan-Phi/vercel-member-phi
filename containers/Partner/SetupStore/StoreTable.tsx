import { useSticky } from "react-table-sticky";
import { CellProps, useSortBy, useTable } from "react-table";
import React, { Fragment, PropsWithChildren, useMemo } from "react";

import { Box } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

import { transformUrl } from "libs";
import { usePermission } from "hooks";

import {
  responseSchema,
  MERCHANTS_ITEM,
  CommonTableProps,
  MERCHANTS_STORES_ITEM,
  MERCHANTS_STORES_CATEGORIES_ITEM,
} from "interfaces";

import {
  Link,
  Table,
  TableBody,
  TableHead,
  RenderBody,
  RenderHeader,
  TableContainer,
  ActionTableCell,
  TablePagination,
  WrapperTableCell,
  TableCellWithFetch,
} from "components";

type StoreTableProps = CommonTableProps<MERCHANTS_STORES_ITEM> & Record<string, any>;

const StoreTable = (props: StoreTableProps) => {
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
          const { cell } = props;

          return (
            <WrapperTableCell title={`${cell.value}`} maxWidth={150}>
              {cell.value}
            </WrapperTableCell>
          );
        },
        minWidth: 150,
        maxWidth: 150,
      },
      {
        Header: "Đối tác",
        accessor: "merchant",
        minWidth: 220,
        maxWidth: 220,
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_STORES_ITEM, any>>) => {
          const { cell, onGotoHandler, column } = props;
          const value = cell.value;
          const { hasPermission } = usePermission("read_merchant");

          return (
            <TableCellWithFetch<MERCHANTS_ITEM> url={value}>
              {(data) => {
                const firstName = data.first_name;
                const lastName = data.last_name;

                const fullName = `${lastName} ${firstName}`;

                return (
                  <WrapperTableCell title={fullName} maxWidth={250}>
                    {hasPermission ? (
                      <Link href={"#"} onClick={onGotoHandler({ row: data, column })}>
                        {fullName}
                      </Link>
                    ) : (
                      fullName
                    )}
                  </WrapperTableCell>
                );
              }}
            </TableCellWithFetch>
          );
        },
      },
      {
        Header: "Danh mục",
        accessor: "category",
        maxWidth: 200,
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_STORES_ITEM, any>>) => {
          const { cell } = props;

          const value = cell.value;

          return (
            <TableCellWithFetch<MERCHANTS_STORES_CATEGORIES_ITEM> url={value}>
              {(data) => {
                return <WrapperTableCell title={data.name}>{data.name}</WrapperTableCell>;
              }}
            </TableCellWithFetch>
          );
        },
      },
      {
        Header: "Số Chi Nhánh",
        accessor: "branches",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_STORES_ITEM, any>>) => {
          const { cell } = props;

          const value = cell.value;

          return (
            <TableCellWithFetch<responseSchema<MERCHANTS_STORES_CATEGORIES_ITEM>>
              url={transformUrl(value, { with_count: true, limit: 0 })}
            >
              {(data) => {
                let count = data.count || "0";

                if (count) {
                  return (
                    <WrapperTableCell title={count} textAlign="center">
                      {count}
                    </WrapperTableCell>
                  );
                } else {
                  return <Fragment></Fragment>;
                }
              }}
            </TableCellWithFetch>
          );
        },
      },
      {
        Header: "Trạng Thái",
        accessor: "is_active",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_STORES_ITEM, any>>) => {
          const { cell } = props;

          const value = cell.value;

          return (
            <WrapperTableCell textAlign="center">
              <CircleIcon color={value ? "primary2" : "primary"} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Hiển Thị",
        accessor: "is_published",

        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_STORES_ITEM, any>>) => {
          const { cell } = props;

          const value = cell.value;

          return (
            <WrapperTableCell textAlign="center">
              <CircleIcon color={value ? "primary2" : "primary"} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Hành Động",
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

export default StoreTable;
