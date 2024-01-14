import { useMemo } from "react";
import {
  Paper,
  TableProps,
  TableFooter,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  TableContainerProps,
  TableContainer as MuiTableContainer,
} from "@mui/material";

import { HeaderGroup, Row, TableInstance } from "react-table";

import Table from "./Table";
import TableHead from "./TableHead";
import TableBody from "./TableBody";

import Body from "./StatefulBody";
import Header from "./StatefulHeader";

export type Props<T extends Record<string, unknown>> = {
  bodyItemList?: Row<T>[];
  TableProps?: TableProps;
  TableRowProps?: TableRowProps;
  headerItemList?: HeaderGroup<T>[];
  TableBodyProps?: TableBodyProps;
  TableHeadProps?: TableHeadProps;
  TableCellProps?: TableCellProps;
  prepareRow: (row: Row<T>) => void;
  renderBodyItem?: (
    rows: Row<T>[] | undefined,
    tableInstance: TableInstance<any>
  ) => React.ReactNode;

  renderHeaderContentForSelectedRow?: (
    tableInstance: TableInstance<any>
  ) => React.ReactNode;
  renderPagination?: () => React.ReactNode;
  renderHeaderItem?: () => React.ReactNode;
  TableContainerProps?: TableContainerProps;
  tableInstance: TableInstance<any>;
};

const CompoundTable = <T extends Record<string, unknown>>(props: Props<T>) => {
  const {
    TableProps,
    prepareRow,
    bodyItemList,
    TableCellProps,
    headerItemList,
    TableBodyProps,
    TableHeadProps,
    renderBodyItem,
    renderPagination,
    renderHeaderItem,
    TableContainerProps,
    tableInstance,
    renderHeaderContentForSelectedRow,
  } = props;

  const renderFooter = useMemo(() => {
    if (renderPagination == undefined) return;

    return <TableFooter>{renderPagination()}</TableFooter>;
  }, [renderPagination]);

  return (
    <MuiTableContainer component={Paper} {...TableContainerProps}>
      <Table {...TableProps}>
        <TableHead {...TableHeadProps}>
          <Header
            {...{
              renderHeaderItem,
              headerItemList,
              renderHeaderContentForSelectedRow,
              TableCellProps,
              tableInstance,
            }}
          />
        </TableHead>
        <TableBody {...TableBodyProps}>
          <Body
            {...{
              prepareRow,
              tableInstance,
              bodyItemList,
              renderBodyItem,
              TableCellProps,
            }}
          />
        </TableBody>

        {renderFooter}
      </Table>
    </MuiTableContainer>
  );
};

export default CompoundTable;
