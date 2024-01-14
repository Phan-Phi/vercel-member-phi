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
  responseSchema,
} from "interfaces";
import { formatDate, formatPhoneNumber, getDisplayValueFromChoiceItem } from "libs";
import { useSticky } from "react-table-sticky";

export default function AdvertisementTable(props: any) {
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
        accessor: "last_name",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_ITEM, any>>) => {
          const { row } = props;
          const banner = get(row, "original.banner");

          return <TableCellForAvatar src={banner} />;
        },
      },
      {
        Header: "Tiêu Đề",
        accessor: "first_name",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_ITEM, any>>) => {
          const { row } = props;
          const name = get(row, "original.title");

          return <WrapperTableCell title={name}>{name}</WrapperTableCell>;
        },
        maxWidth: 300,
      },

      {
        Header: "Vị Trí",
        accessor: "position",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_ITEM, any>>) => {
          const { cell } = props;

          const choice = useChoice();

          const { positions } = choice;

          const value = getDisplayValueFromChoiceItem(positions, cell.value[0]);

          const displayValueList = cell.value.map((el: string) => {
            return getDisplayValueFromChoiceItem(positions, el);
          });

          return (
            <WrapperTableCell title={value}>
              {displayValueList.join(", ")}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Đối Tượng",
        accessor: "app_type",
        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_ITEM, any>>) => {
          const choice = useChoice();
          const { cell } = props;
          const { app_type } = choice;

          const value = getDisplayValueFromChoiceItem(app_type, cell.value[0]);

          if (value) {
            return <WrapperTableCell justifyContent="left">{value}</WrapperTableCell>;
          } else {
            return null;
          }
        },
      },
      {
        Header: "Độ Ưu Tiên",
        accessor: "sort_order",

        Cell: (props: PropsWithChildren<CellProps<MERCHANTS_ITEM, any>>) => {
          const { cell } = props;

          const value = cell.value || "-";

          return (
            <WrapperTableCell display="flex" justifyContent="flex-end" minWidth={80}>
              {value}
            </WrapperTableCell>
          );
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

          const { hasPermission } = usePermission("write_advertisement");

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
