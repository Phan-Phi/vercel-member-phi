import { get } from "lodash";
import { Box } from "@mui/material";
import { useSticky } from "react-table-sticky";
import { useMemo, PropsWithChildren } from "react";
import { useTable, useSortBy, CellProps } from "react-table";

import CircleIcon from "@mui/icons-material/Circle";

import {
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
import {
  ADMINS_ITEM,
  GROUPS_ITEM,
  responseSchema,
  AVATARS_CATEGORIES_ITEM,
} from "interfaces";
import { usePermission } from "hooks";
import { formatDate, formatPhoneNumber } from "libs";

export default function AdminTable(props: any) {
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
        Header: "Họ",
        accessor: "last_name",
        Cell: (props: PropsWithChildren<CellProps<AVATARS_CATEGORIES_ITEM, any>>) => {
          const { row } = props;
          const name = get(row, "original.last_name");

          return <WrapperTableCell title={name}>{name}</WrapperTableCell>;
        },
      },
      {
        Header: "Tên",
        accessor: "first_name",
        Cell: (props: PropsWithChildren<CellProps<ADMINS_ITEM, any>>) => {
          const { row } = props;
          const name = get(row, "original.first_name");

          return <WrapperTableCell title={name}>{name}</WrapperTableCell>;
        },
      },

      {
        Header: "SĐT",
        accessor: "phone_number",
        Cell: (props: PropsWithChildren<CellProps<ADMINS_ITEM, any>>) => {
          const { value } = props;

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
        Cell: (props: PropsWithChildren<CellProps<ADMINS_ITEM, any>>) => {
          const { value } = props;

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
      },
      {
        Header: "Vai trò",
        accessor: "groups",
        Cell: (props: PropsWithChildren<CellProps<ADMINS_ITEM, any>>) => {
          const { value } = props;

          return (
            <TableCellWithFetch<responseSchema<GROUPS_ITEM>> url={value}>
              {(data) => {
                const position = get(data, "results[0].name") || "-";

                return <WrapperTableCell maxWidth={250}>{position}</WrapperTableCell>;
              }}
            </TableCellWithFetch>
          );
        },
      },
      {
        Header: "Trạng thái",
        accessor: "is_active",
        textAlign: "center",
        Cell: (props: PropsWithChildren<CellProps<ADMINS_ITEM, any>>) => {
          const { cell } = props;
          const value = cell.value;

          return (
            <WrapperTableCell display="flex" justifyContent="center" minWidth={80}>
              <CircleIcon color={value ? "primary2" : "primary"} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Ngày tạo",
        accessor: "date_joined",
        Cell: (props: PropsWithChildren<CellProps<ADMINS_ITEM, any>>) => {
          const { value } = props;

          if (value == undefined) return null;

          return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
        },
      },
      {
        Header: "Hành động",
        accessor: "",
        sticky: "right",
        Cell: (props: PropsWithChildren<CellProps<AVATARS_CATEGORIES_ITEM, any>>) => {
          const { onDeleteHandler, onViewHandler, column, row } = props;

          const { hasPermission } = usePermission("write_admin");

          return (
            <ActionTableCell
              onViewHandler={onViewHandler}
              onDeleteHandler={hasPermission ? onDeleteHandler : undefined}
              column={column}
              row={row}
              //   loading={loading}
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
