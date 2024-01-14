import React, { PropsWithChildren, useMemo } from "react";

import { Box } from "@mui/material";
import { CellProps, useTable, useSortBy } from "react-table";

import { useChoice } from "hooks";
import { AUDITLOGS_ITEM, CommonTableProps } from "interfaces";
import {
  Table,
  TableHead,
  TableBody,
  RenderBody,
  RenderHeader,
  TableContainer,
  TablePagination,
  WrapperTableCell,
} from "components";
import { formatDate, getDisplayValueFromChoiceItem } from "libs";

type HomeTableProps = CommonTableProps<AUDITLOGS_ITEM>;

const HomeTable = (props: HomeTableProps) => {
  const {
    data,
    count,
    onPageChange,
    onPageSizeChange,
    pagination,
    maxHeight,
    isLoading,
  } = props;

  const columns = useMemo(() => {
    return [
      {
        Header: "Tên Nhân Viên",
        accessor: "actor_name",
        Cell: (props: PropsWithChildren<CellProps<AUDITLOGS_ITEM, any>>) => {
          const { value } = props;

          return <WrapperTableCell title={value}>{value || "-"}</WrapperTableCell>;
        },

        width: 250,
      },

      {
        Header: "Thao tác",
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<AUDITLOGS_ITEM, any>>) => {
          const choice = useChoice();

          const { value } = props;

          const { auditlog_actions } = choice;

          return (
            <WrapperTableCell>
              {getDisplayValueFromChoiceItem(auditlog_actions, value)}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Đối tượng",
        accessor: "source_repr",
        Cell: (props: PropsWithChildren<CellProps<AUDITLOGS_ITEM, any>>) => {
          const { value } = props;

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
        width: 350,
      },
      {
        Header: "Ngày tạo",
        accessor: "date_created",
        Cell: (props: PropsWithChildren<CellProps<AUDITLOGS_ITEM, any>>) => {
          const { value } = props;
          return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
        },
        width: 200,
      },
    ];
  }, []);

  const table = useTable(
    {
      columns: columns as any,
      data,
      manualPagination: true,
      autoResetPage: false,
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
};

export default HomeTable;
