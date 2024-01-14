import { get } from "lodash";
import { Box } from "@mui/material";
import { useMemo, PropsWithChildren } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { useTable, useSortBy, CellProps } from "react-table";

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
import { usePermission } from "hooks";
import {
  ADMINS_ITEM,
  AVATARS_CATEGORIES_ITEM,
  GROUPS_ITEM,
  responseSchema,
} from "interfaces";
import { formatDate, formatPhoneNumber } from "libs";
import { useSticky } from "react-table-sticky";

export default function VersionTable(props: any) {
  const {
    totalItem,
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
        Header: "Phiên Bản",
        accessor: "name",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;
          const name = get(row, "original.name");

          return <WrapperTableCell title={name}>{name}</WrapperTableCell>;
        },
      },
      {
        Header: "Tên Ứng Dụng",
        accessor: "appName",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;
          const name = get(row, "original.appName");

          return <WrapperTableCell title={name}>{name}</WrapperTableCell>;
        },
      },

      {
        Header: "Hệ Điều Hành",
        accessor: "appPlatform",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;
          const app = get(row, "original.appPlatform");

          return <WrapperTableCell title={app}>{app}</WrapperTableCell>;
        },
      },
      {
        Header: "Bắt Buộc",
        accessor: "deprecated",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;
          const deprecated = get(row, "original.deprecated");

          return (
            <WrapperTableCell display="flex" justifyContent="flex-start">
              <CircleIcon color={deprecated ? "primary2" : "primary"} />
            </WrapperTableCell>
          );
        },
      },

      {
        Header: "Hành động",
        accessor: "",
        sticky: "right",
        width: 90,
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { onViewHandler, column, row } = props;
          const { hasPermission } = usePermission("write_version");

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
          count={totalItem}
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
