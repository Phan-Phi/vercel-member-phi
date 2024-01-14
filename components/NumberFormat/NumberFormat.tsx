import React from "react";

import OriginalNumberFormat, { NumberFormatProps } from "react-number-format";

const NumberFormat = (props: NumberFormatProps) => {
  return (
    <OriginalNumberFormat
      displayType="text"
      thousandSeparator={true}
      isNumericString={true}
      {...props}
    />
  );
};

export default NumberFormat;
