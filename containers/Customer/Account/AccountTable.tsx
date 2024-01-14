import { useSticky } from "react-table-sticky";
import { CellProps, useSortBy, useTable } from "react-table";
import React, { Fragment, PropsWithChildren, useMemo } from "react";

import { get } from "lodash";
import { Box } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

import { usePermission } from "hooks";
import { formatDate, formatPhoneNumber } from "libs";

import {
  responseSchema,
  CUSTOMERS_ITEM,
  CommonTableProps,
  CUSTOMERS_WALLETS_ITEM,
} from "interfaces";

import {
  Table,
  TableHead,
  TableBody,
  RenderBody,
  RenderHeader,
  NumberFormat,
  TableContainer,
  ActionTableCell,
  TablePagination,
  WrapperTableCell,
  TableCellWithFetch,
} from "components";

type AccountTableProps = CommonTableProps<CUSTOMERS_ITEM> & Record<string, any>;

const AccountTable = (props: AccountTableProps) => {
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
        accessor: "name",
        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_ITEM, any>>) => {
          const { row } = props;
          const firstName = get(row, "original.first_name");
          const lastName = get(row, "original.last_name");

          return (
            <WrapperTableCell
              title={`${lastName} ${firstName}`}
            >{`${lastName} ${firstName}`}</WrapperTableCell>
          );
        },
        maxWidth: 150,
      },
      {
        Header: "Số Điện Thoại",
        accessor: "phone_number",
        textAlign: "center",
        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_ITEM, any>>) => {
          const { cell } = props;

          const value = cell.value;

          if (value) {
            return (
              <WrapperTableCell justifyContent="center" title={formatPhoneNumber(value)}>
                {formatPhoneNumber(value)}
              </WrapperTableCell>
            );
          } else {
            return null;
          }
        },
      },
      {
        Header: "Điểm Hiện Tại",
        accessor: "wallet",
        maxWidth: 200,
        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_ITEM, any>>) => {
          const { cell } = props;

          const value = cell.value;

          return (
            <TableCellWithFetch<responseSchema<CUSTOMERS_WALLETS_ITEM>> url={value}>
              {(data) => {
                const item = data.results[0];

                const pointIn = get(item, "point_in");
                const pointOut = get(item, "point_out");

                if (pointIn >= 0 && pointOut >= 0) {
                  const point = pointIn - pointOut;

                  return (
                    <WrapperTableCell title={point}>
                      <NumberFormat value={point} />
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
        Header: "Email",
        accessor: "email",
        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_ITEM, any>>) => {
          const { cell } = props;

          const value = cell.value;

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
        maxWidth: 180,
      },
      {
        Header: "Trạng thái",
        accessor: "is_active",
        textAlign: "center",
        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_ITEM, any>>) => {
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
        Header: "Ngày tạo",
        accessor: "date_joined",
        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_ITEM, any>>) => {
          const { cell } = props;

          const value = cell.value;

          return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
        },
      },
      {
        Header: "Hành động",
        accessor: "",
        sticky: "right",
        Cell: (props: PropsWithChildren<CellProps<CUSTOMERS_ITEM, any>>) => {
          const { onDeleteHandler, onViewHandler, column, row } = props;

          const { hasPermission } = usePermission("write_customer");

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
};

export default AccountTable;
