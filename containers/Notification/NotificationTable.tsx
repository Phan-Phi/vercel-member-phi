import React, { Fragment } from "react";

import { get } from "lodash";
import { Box } from "@mui/material";
import { useMemo, PropsWithChildren } from "react";
import { useTable, useSortBy, CellProps } from "react-table";
import CircleIcon from "@mui/icons-material/Circle";

import {
  ActionTableCell,
  RenderBody,
  RenderHeader,
  Table,
  TableBody,
  TableCellForAvatar,
  TableCellWithFetch,
  TableContainer,
  TableHead,
  TablePagination,
  WrapperTableCell,
} from "components";
import { useChoice, usePermission } from "hooks";
import {
  ADMINS_ITEM,
  AVATARS_CATEGORIES_ITEM,
  GROUPS_ITEM,
  MERCHANTS_ITEM,
  NOTIFICATIONS_FILE_NOTIFICATIONS_ITEM,
  NOTIFICATIONS_WALLETS_ITEM,
  responseSchema,
} from "interfaces";
import {
  formatDate,
  formatPhoneNumber,
  getDisplayValueFromChoiceItem,
  transformUrl,
} from "libs";

export default function NotificationTable(props: any) {
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
        Header: "Banner",
        accessor: "image",
        Cell: (
          props: PropsWithChildren<CellProps<NOTIFICATIONS_FILE_NOTIFICATIONS_ITEM, any>>
        ) => {
          const { row } = props;
          const banner = get(row, "original.image");

          return <TableCellForAvatar src={banner} />;
        },
      },
      {
        Header: "Tiêu Đề",
        accessor: "title",
        Cell: (
          props: PropsWithChildren<CellProps<NOTIFICATIONS_FILE_NOTIFICATIONS_ITEM, any>>
        ) => {
          const { row } = props;
          const name = get(row, "original.title");

          return <WrapperTableCell title={name}>{name}</WrapperTableCell>;
        },
        maxWidth: 300,
      },

      {
        Header: "Đối Tượng",
        accessor: "app_type",
        Cell: (
          props: PropsWithChildren<CellProps<NOTIFICATIONS_FILE_NOTIFICATIONS_ITEM, any>>
        ) => {
          const choice = useChoice();
          const { cell } = props;
          const { app_type } = choice;

          const value = getDisplayValueFromChoiceItem(app_type, cell.value);

          return <WrapperTableCell justifyContent="left">{value}</WrapperTableCell>;
        },
      },

      {
        Header: "Ngày tạo",
        accessor: "date_created",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_ITEM, any>>) => {
          const { cell } = props;

          const value = cell.value;

          return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
        },
      },
      {
        Header: "Hành động",
        accessor: "",
        sticky: "right",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_ITEM, any>>) => {
          const { onDeleteHandler, onViewHandler, column, row } = props;
          const linkPushTime = get(row, "original.push_times");

          const { hasPermission } = usePermission("write_notification");

          return (
            <TableCellWithFetch<responseSchema<NOTIFICATIONS_WALLETS_ITEM>>
              url={transformUrl(linkPushTime, { limit: 1, with_count: true })}
            >
              {(data) => {
                const count = data.count;

                if (count !== undefined) {
                  return (
                    <ActionTableCell
                      onViewHandler={onViewHandler}
                      onDeleteHandler={hasPermission ? onDeleteHandler : undefined}
                      column={column}
                      row={row}
                      checkDeletePushTime={count}
                      //   loading={loading}
                    />
                  );
                } else {
                  return <Fragment></Fragment>;
                }
              }}
            </TableCellWithFetch>
            // <ActionTableCell
            //   onViewHandler={onViewHandler}
            //   onDeleteHandler={hasPermission ? onDeleteHandler : undefined}
            //   column={column}
            //   row={row}
            //   checkDeletePushTime={count}
            //   //   loading={loading}
            // />
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
