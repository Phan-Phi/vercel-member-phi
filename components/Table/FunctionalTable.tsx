import React, { useMemo } from "react";

import { useTable, TableOptions, TableInstance } from "react-table";

import CompoundTable, { type Props as CompoundTableProps } from "./CompoundTable";

interface ExtendTableOptions extends TableOptions<{}> {
  hooks?: any[];
  // renderTable?: (tableInstance: TableInstance) => React.ReactNode;
}

const FunctionalTable = (props: ExtendTableOptions) => {
  const { hooks = [], renderTable, ...restProps } = props;

  const tableInstance = useTable(
    {
      ...restProps,
    },
    ...hooks
  );

  // const renderContent = useMemo(() => {
  //   if (typeof renderTable === "function") {
  //     return renderTable(tableInstance);
  //   }

  //   const { prepareRow } = tableInstance;

  //   return <CompoundTable prepareRow={prepareRow} />;
  // }, [renderTable, tableInstance]);

  // return renderContent;
};

export default FunctionalTable;
