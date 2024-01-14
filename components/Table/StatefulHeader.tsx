import { Fragment } from "react";
import { HeaderGroup } from "react-table";

import isEmpty from "lodash/isEmpty";

import TableRow from "./TableRow";
import TableCell from "./TableCell";
import CompoundTable from "./CompoundTable";

type HeaderKey =
  | "renderHeaderItem"
  | "renderHeaderContentForSelectedRow"
  | "TableCellProps"
  | "tableInstance";

type HeaderProps<T extends Record<string, unknown>> = Pick<
  React.ComponentPropsWithoutRef<typeof CompoundTable>,
  HeaderKey
> & {
  headerItemList?: HeaderGroup<T>[];
};

const StatefulHeader = <T extends Record<string, unknown>>(props: HeaderProps<T>) => {
  const {
    tableInstance,
    TableCellProps,
    headerItemList,
    renderHeaderContentForSelectedRow,
    renderHeaderItem,
  } = props;

  if (typeof renderHeaderItem === "function") {
    return <Fragment>{renderHeaderItem()}</Fragment>;
  }

  if (headerItemList) {
    if (!isEmpty(tableInstance.selectedFlatRows)) {
      return (
        <Fragment>
          {headerItemList.map((headerGroup) => {
            const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();

            return (
              <TableRow key={key} {...restHeaderGroupProps}>
                {headerGroup.headers.map((column) => {
                  if (column.id !== "selection") return null;

                  const { key } = column.getHeaderProps();

                  return (
                    <Fragment key={key}>
                      <TableCell
                        {...column.getHeaderProps()}
                        {...(column.colSpan && {
                          colSpan: column.colSpan,
                        })}
                        sx={{
                          width: column.width,
                          minWidth: column.minWidth,
                          maxWidth: column.maxWidth,
                        }}
                        {...TableCellProps}
                      >
                        {column.render("Header")}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="col"
                        colSpan={tableInstance.allColumns.length * 2}
                      >
                        {renderHeaderContentForSelectedRow?.(tableInstance)}
                      </TableCell>
                    </Fragment>
                  );
                })}
              </TableRow>
            );
          })}
        </Fragment>
      );
    }

    return (
      <Fragment>
        {headerItemList.map((headerGroup) => {
          const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();

          return (
            <TableRow key={key} {...restHeaderGroupProps}>
              {headerGroup.headers.map((column) => {
                const { key, ...restHeaderProps } = column.getHeaderProps();

                return (
                  <TableCell
                    key={key}
                    {...restHeaderProps}
                    {...(column.colSpan && {
                      colSpan: column.colSpan,
                    })}
                    sx={{
                      width: column.width,
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      textAlign: column.textAlign,
                      whiteSpace: "nowrap",
                    }}
                    {...TableCellProps}
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
  }

  return <Fragment />;
};

export default StatefulHeader;
