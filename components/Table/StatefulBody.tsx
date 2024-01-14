import React, { Fragment } from "react";
import { Row, TableInstance } from "react-table";

import isEmpty from "lodash/isEmpty";

import TableRow from "./TableRow";
import TableCell from "./TableCell";
import CompoundTable from "./CompoundTable";

type BodyKey = "TableCellProps" | "tableInstance";

type HeaderProps<T extends Record<string, unknown>> = Pick<
  React.ComponentPropsWithoutRef<typeof CompoundTable>,
  BodyKey
> & {
  bodyItemList?: Row<T>[];
  prepareRow: (row: Row<T>) => void;
  renderBodyItem?: (
    rows: Row<T>[] | undefined,
    tableInstance: TableInstance<any>
  ) => React.ReactNode;
};

const StatefulBody = <T extends Record<string, unknown>>(props: HeaderProps<T>) => {
  const { tableInstance, bodyItemList, renderBodyItem, prepareRow, TableCellProps } =
    props;

  if (typeof renderBodyItem === "function") {
    return <Fragment>{renderBodyItem(bodyItemList, tableInstance)}</Fragment>;
  }

  if (bodyItemList == undefined) return <Fragment />;

  if (isEmpty(bodyItemList)) {
    return (
      <TableRow>
        <TableCell
          colSpan={30}
          align="center"
          sx={{
            paddingY: 2,
          }}
        >
          Không có dữ liệu
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Fragment>
      {bodyItemList.map((row, i) => {
        prepareRow(row);

        const { key, ...restRowProps } = row.getRowProps();

        return (
          <TableRow key={key} {...restRowProps}>
            {row.cells.map((cell) => {
              const { key, ...restCellProps } = cell.getCellProps();

              return (
                <TableCell
                  key={key}
                  {...restCellProps}
                  {...(cell.column.colSpan && {
                    colSpan: cell.column.colSpan,
                  })}
                  sx={{
                    width: cell.column.width,
                    minWidth: cell.column.minWidth,
                    maxWidth: cell.column.maxWidth,
                  }}
                  {...TableCellProps}
                >
                  {cell.render("Cell")}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </Fragment>
  );
};

export default StatefulBody;
