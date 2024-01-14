import { useSticky } from "react-table-sticky";
import { PropsWithChildren, useMemo } from "react";
import { CellProps, useSortBy, useTable } from "react-table";

import { get } from "lodash";
import { Box, Stack, IconButton } from "@mui/material";

import { useChoice, usePermission } from "hooks";
import { POINTNOTES_ITEM, CommonTableProps } from "interfaces";
import { formatDate, getDisplayValueFromChoiceItem } from "libs";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";

import {
  Link,
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

type PointNoteTableProps = CommonTableProps<POINTNOTES_ITEM> & Record<string, any>;

const PointNoteTable = (props: PointNoteTableProps) => {
  const {
    data,
    count,
    onPageChange,
    // onRecoverPoints,
    onPageSizeChange,
    pagination,
    maxHeight,
    isLoading,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    return [
      {
        // Header: "Tên Đối Tác",
        Header: "Loại Đối Tượng",
        accessor: "owner_name",
        Cell: (props: PropsWithChildren<CellProps<POINTNOTES_ITEM, any>>) => {
          const { hasPermission } = usePermission("read_merchant");

          const { cell, onGotoHandler, row, column } = props;

          // const value = cell.value;
          const value = get(row, "original.owner_name");
          const isOwner = get(row, "original.owner");
          const isOwnerAsCustomer = get(row, "original.owner_as_customer");

          if (isOwner) {
            return (
              <WrapperTableCell title={`${value} (Đối Tác)`}>
                {hasPermission ? (
                  <Link
                    href="#"
                    onClick={onGotoHandler({
                      row,
                      column,
                    })}
                  >
                    {value} (Đối Tác)
                  </Link>
                ) : (
                  value
                )}
              </WrapperTableCell>
            );
          }

          if (isOwnerAsCustomer) {
            return (
              <WrapperTableCell title={`${value} (Khách Hàng)`}>
                {hasPermission ? (
                  <Link
                    href="#"
                    onClick={onGotoHandler({
                      row,
                      column,
                    })}
                  >
                    {value} (Khách Hàng)
                  </Link>
                ) : (
                  value
                )}
              </WrapperTableCell>
            );
          }
          return <WrapperTableCell title={value}>-</WrapperTableCell>;
        },
        colSpan: 2,
      },

      // {
      //   Header: "Tên Khách Hàng",
      //   accessor: "owner_as_customer_name",
      //   Cell: (props: PropsWithChildren<CellProps<POINTNOTES_ITEM, any>>) => {
      //     const { hasPermission } = usePermission("read_merchant");

      //     const { cell, onGotoHandler, row, column } = props;

      //     const value = get(row, "original.owner_name");
      //     const isOwnerAsCustomer = get(row, "original.owner_as_customer");

      //     if (isOwnerAsCustomer) {
      //       return (
      //         <WrapperTableCell title={value}>
      //           {hasPermission ? (
      //             <Link
      //               href="#"
      //               onClick={onGotoHandler({
      //                 row,
      //                 column,
      //               })}
      //             >
      //               {value}
      //             </Link>
      //           ) : (
      //             value
      //           )}
      //         </WrapperTableCell>
      //       );
      //     }
      //     return <WrapperTableCell title={value}>-</WrapperTableCell>;
      //   },
      //   colSpan: 2,
      // },
      {
        Header: "Số Điểm",
        accessor: "point_amount",
        textAlign: "right",
        minWidth: 100,
        Cell: (props: PropsWithChildren<CellProps<POINTNOTES_ITEM, any>>) => {
          const { cell, row } = props;

          const flowType = get(row, "original.flow_type");

          const value = cell.value;

          return (
            <WrapperTableCell title={value}>
              <NumberFormat
                value={value}
                prefix={flowType === "Point_To_Cash" ? "-" : "+"}
              />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Loại Yêu Cầu",
        accessor: "flow_type",
        Cell: (props: PropsWithChildren<CellProps<POINTNOTES_ITEM, any>>) => {
          const { point_note_flow_types } = useChoice();

          const { cell } = props;

          const value = cell.value;

          const displayValue =
            getDisplayValueFromChoiceItem(point_note_flow_types, value) ?? "-";

          return <WrapperTableCell title={displayValue}>{displayValue}</WrapperTableCell>;
        },
      },
      {
        Header: "Trạng Thái",
        accessor: "status",
        minWidth: 100,
        Cell: (props: PropsWithChildren<CellProps<POINTNOTES_ITEM, any>>) => {
          const { point_note_statuses } = useChoice();

          const { cell } = props;

          const value = cell.value;

          const displayValue =
            getDisplayValueFromChoiceItem(point_note_statuses, value) ?? "-";

          return (
            <WrapperTableCell
              title={displayValue}
              color={value === "Confirmed" ? "primary2.main" : "primary.main"}
            >
              {displayValue}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Ngày Tạo",
        accessor: "date_placed",
        textAlign: "center",
        Cell: (props: PropsWithChildren<CellProps<POINTNOTES_ITEM, any>>) => {
          const { cell } = props;

          const value = cell.value;

          return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
        },
      },
      {
        Header: "Người duyệt",
        accessor: "reviewer_name",
        Cell: (props: PropsWithChildren<CellProps<POINTNOTES_ITEM, any>>) => {
          const { cell } = props;

          const value = cell.value;

          return <WrapperTableCell>{value || "-"}</WrapperTableCell>;
        },
      },
      {
        Header: "Hành động",
        accessor: "",
        sticky: "right",
        Cell: (props: PropsWithChildren<CellProps<POINTNOTES_ITEM, any>>) => {
          const { onDeleteHandler, onViewHandler, column, row, onRecoverPoints } = props;

          const { hasPermission } = usePermission("read_point_note");
          const { hasPermission: hasPermissionWrite } = usePermission("write_point_note");

          const flowType = get(row, "original.flow_type");
          const _status = get(row, "original.status");

          return (
            <Stack direction="row" alignItems="center">
              {hasPermission && (
                <ActionTableCell
                  onViewHandler={onViewHandler}
                  onDeleteHandler={onDeleteHandler}
                  column={column}
                  row={row}
                />
              )}
              {hasPermissionWrite &&
                flowType === "Cash_To_Point" &&
                _status === "Confirmed" && (
                  <IconButton
                    onClick={() => {
                      onRecoverPoints({ row, column });
                    }}
                  >
                    <CreditCardOffIcon />
                  </IconButton>
                )}
            </Stack>
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

export default PointNoteTable;
