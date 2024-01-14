import React, { Fragment } from "react";
import { TableInstance } from "react-table";

import TableRow from "./TableRow";
import TableCell from "./TableCell";
import { Box, Skeleton, Typography } from "@mui/material";

interface RenderBodyProps {
  table: TableInstance<any>;
  loading?: boolean;
}

const RenderBody = (props: RenderBodyProps) => {
  const { table, loading } = props;

  if (loading) {
    return (
      <Fragment>
        {[...new Array(15)].map((_, idx) => {
          return (
            <TableRow key={idx}>
              {table.visibleColumns.map((el) => {
                return (
                  <TableCell
                    colSpan={el.colSpan}
                    width={el.width}
                    maxWidth={el.maxWidth}
                    key={el.id}
                  >
                    <Skeleton />
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </Fragment>
    );
  }

  if (table.rows.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={100}>
          <Typography textAlign="center">Không có dữ liệu</Typography>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Fragment>
      {table.rows.map((row, idx) => {
        table.prepareRow(row);
        return (
          <TableRow {...row.getRowProps()} key={idx}>
            {row.cells.map((cell, idx) => {
              return (
                <TableCell
                  {...cell.getCellProps()}
                  key={idx}
                  width={cell.column.width}
                  colSpan={cell.column.colSpan}
                  maxWidth={cell.column.maxWidth}
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

export default RenderBody;
