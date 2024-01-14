import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useSortBy, useTable } from "react-table";

import { get } from "lodash";
import { Box, Typography, IconButton } from "@mui/material";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { useChoice, usePermission } from "hooks";
import { formatDate, getDisplayValueFromChoiceItem } from "libs";
import { PENDING_IMAGES_ITEM, CommonTableProps, MERCHANTS_ITEM } from "interfaces";

import {
  Link,
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

type AvatarTableProps = CommonTableProps<PENDING_IMAGES_ITEM> & Record<string, any>;

const AvatarTable = (props: AvatarTableProps) => {
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
        Header: "Hình Ảnh",
        accessor: "original",
        Cell: (props: PropsWithChildren<CellProps<PENDING_IMAGES_ITEM, any>>) => {
          const { cell } = props;

          const value = cell.value;

          return <TableCellForAvatar src={value} />;
        },
      },
      {
        Header: "Loại",
        accessor: "signature",

        Cell: (props: PropsWithChildren<CellProps<PENDING_IMAGES_ITEM, any>>) => {
          const { cell } = props;
          const { pending_image_signature } = useChoice();

          const value = cell.value;

          return (
            <WrapperTableCell title={value}>
              {getDisplayValueFromChoiceItem(pending_image_signature, value)}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Trạng Thái",
        accessor: "is_confirmed",
        Cell: (props: PropsWithChildren<CellProps<PENDING_IMAGES_ITEM, any>>) => {
          const { cell } = props;

          const value = cell.value;

          return (
            <WrapperTableCell>
              <Typography
                variant="body2"
                color={value ? "primary2.main" : "primary.main"}
              >
                {value ? "Hoàn tất" : "Chờ"}
              </Typography>
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Ngày Tạo",
        accessor: "date_created",
        Cell: (props: PropsWithChildren<CellProps<PENDING_IMAGES_ITEM, any>>) => {
          const { cell } = props;

          const value = cell.value;

          return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
        },
      },
      {
        Header: "Đăng Bởi",
        accessor: "owner",
        Cell: (props: PropsWithChildren<CellProps<PENDING_IMAGES_ITEM, any>>) => {
          const { cell, row, onGotoHandler, column } = props;

          const value = cell.value;

          const { hasPermission } = usePermission("read_merchant");

          if (!hasPermission) return <WrapperTableCell>-</WrapperTableCell>;

          return (
            <TableCellWithFetch<MERCHANTS_ITEM> url={value}>
              {(data) => {
                return (
                  <WrapperTableCell>
                    {data.email ? (
                      <Link
                        href="#"
                        onClick={onGotoHandler({
                          row,
                          column,
                        })}
                      >
                        {data.email}
                      </Link>
                    ) : (
                      ""
                    )}
                  </WrapperTableCell>
                );
              }}
            </TableCellWithFetch>
          );
        },
      },
      {
        Header: "Người Duyệt",
        accessor: "confirmed_by_person_email",
        Cell: (props: PropsWithChildren<CellProps<PENDING_IMAGES_ITEM, any>>) => {
          const { cell } = props;
          const value = cell.value;
          return <WrapperTableCell>{value || "-"}</WrapperTableCell>;
        },
      },
      {
        Header: "Hành động",
        accessor: "",
        sticky: "right",
        Cell: (props: PropsWithChildren<CellProps<PENDING_IMAGES_ITEM, any>>) => {
          const { hasPermission } = usePermission("approve_pending_image");

          const { onApproveHandler, onViewHandler, column, row } = props;

          const isConfirmed = get(row, "original.is_confirmed");

          return (
            <WrapperTableCell>
              <IconButton onClick={onViewHandler({ row, column })}>
                <VisibilityOutlinedIcon />
              </IconButton>

              {hasPermission && !isConfirmed && (
                <IconButton
                  onClick={onApproveHandler({
                    row,
                    column,
                  })}
                >
                  <CheckOutlinedIcon />
                </IconButton>
              )}
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

export default AvatarTable;
