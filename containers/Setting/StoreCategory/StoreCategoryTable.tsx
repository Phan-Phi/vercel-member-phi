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
import { MERCHANTS_STORES_CATEGORIES_ITEM } from "interfaces";

export default function StoreCategoryTable(props: any) {
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
        accessor: "names",
        Cell: (
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_CATEGORIES_ITEM, any>>
        ) => {
          const { row } = props;
          const image = get(row, "original.icon_for_member");

          return <TableCellForAvatar src={image} />;
        },
      },
      {
        Header: "Ảnh Đại Diện",
        accessor: "name",
        Cell: (
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_CATEGORIES_ITEM, any>>
        ) => {
          const { row } = props;
          const name = get(row, "original.name");

          return (
            <WrapperTableCell title={name} maxWidth={250}>
              {name}
            </WrapperTableCell>
          );
        },

        colSpan: 3,
      },
      {
        Header: "Hành động",
        accessor: "",
        sticky: "right",
        Cell: (
          props: PropsWithChildren<CellProps<MERCHANTS_STORES_CATEGORIES_ITEM, any>>
        ) => {
          const { onDeleteHandler, onViewHandler, column, row } = props;

          const { hasPermission } = usePermission("write_store_category");

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
