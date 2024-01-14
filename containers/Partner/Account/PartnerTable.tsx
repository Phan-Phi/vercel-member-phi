import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useSortBy, useTable } from "react-table";

import { get } from "lodash";
import { Box } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

import { usePermission } from "hooks";
import { formatDate, formatPhoneNumber } from "libs";
import { CommonTableProps, MERCHANTS_ITEM } from "interfaces";

import {
  ActionTableCell,
  RenderBody,
  RenderHeader,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  WrapperTableCell,
} from "components";

type PartnerTableProps = CommonTableProps<MERCHANTS_ITEM> & Record<string, any>;

const PartnerTable = (props: PartnerTableProps) => {
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
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_ITEM, any>>) => {
          const { row } = props;
          const firstName = get(row, "original.first_name");
          const lastName = get(row, "original.last_name");

          return (
            <WrapperTableCell
              title={`${lastName} ${firstName}`}
              maxWidth={250}
            >{`${lastName} ${firstName}`}</WrapperTableCell>
          );
        },
      },
      {
        Header: "Số điện thoại",
        accessor: "phone_number",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_ITEM, any>>) => {
          const { value } = props;

          if (value == undefined) return null;

          return (
            <WrapperTableCell title={formatPhoneNumber(value)}>
              {formatPhoneNumber(value)}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_ITEM, any>>) => {
          const { value } = props;

          return (
            <WrapperTableCell maxWidth={200} title={value}>
              {value}
            </WrapperTableCell>
          );
        },
      },

      {
        Header: "Trạng thái",
        accessor: "is_active",
        textAlign: "center",
        maxWidth: 100,
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_ITEM, any>>) => {
          const { value } = props;

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
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_ITEM, any>>) => {
          const { value } = props;

          return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
        },
      },
      {
        Header: "Hành động",
        accessor: "",
        sticky: "right",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_ITEM, any>>) => {
          const { onDeleteHandler, onViewHandler, column, row } = props;

          const { hasPermission } = usePermission("write_merchant");

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

export default PartnerTable;
