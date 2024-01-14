import React, { Fragment } from "react";
import { TableInstance } from "react-table";

import TableRow from "./TableRow";
import TableCell from "./TableCell";

interface RenderHeaderProps {
  table: TableInstance<any>;
}

const RenderHeader = (props: RenderHeaderProps) => {
  const { table } = props;

  return (
    <Fragment>
      {table.headerGroups.map((headerGroup) => {
        return (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => {
              return (
                <TableCell
                  {...column.getHeaderProps()}
                  colSpan={column.colSpan}
                  maxWidth={column.maxWidth}
                  width={column.width}
                >
                  {column.render("Header")}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </Fragment>
  );
};

export default RenderHeader;
