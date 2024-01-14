import { get } from "lodash";
import { Box } from "@mui/material";
import { useSticky } from "react-table-sticky";
import { useMemo, PropsWithChildren } from "react";
import { useTable, useSortBy, CellProps } from "react-table";

import {
  ActionTableCell,
  RenderBody,
  RenderHeader,
  Table,
  TableBody,
  TableCellForAvatar,
  TableContainer,
  TableHead,
  TablePagination,
  WrapperTableCell,
} from "components";
import { usePermission } from "hooks";
import { AVATARS_CATEGORIES_ITEM } from "interfaces";

export default function ListingAvatarTable(props: any) {
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
        Header: "Ảnh Đại Diện",
        accessor: "image",
        Cell: (props: PropsWithChildren<CellProps<AVATARS_CATEGORIES_ITEM, any>>) => {
          const { row } = props;
          const imageItem = get(row, "original.image");

          return <TableCellForAvatar src={imageItem} />;
        },
      },
      {
        Header: "Tên Danh Mục",
        accessor: "name",
        Cell: (props: PropsWithChildren<CellProps<AVATARS_CATEGORIES_ITEM, any>>) => {
          const { row } = props;
          const name = get(row, "original.name");

          return <WrapperTableCell title={name}>{name}</WrapperTableCell>;
        },

        colSpan: 3,
      },
      {
        Header: "Hành động",
        accessor: "",
        sticky: "right",
        Cell: (props: PropsWithChildren<CellProps<AVATARS_CATEGORIES_ITEM, any>>) => {
          const { onDeleteHandler, onViewHandler, column, row } = props;

          const { hasPermission } = usePermission("write_avatar_category");

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
