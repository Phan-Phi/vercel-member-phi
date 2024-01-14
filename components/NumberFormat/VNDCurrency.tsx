import React from "react";

import NumberFormat from "./NumberFormat";

const VNDCurrency = (props: React.ComponentPropsWithoutRef<typeof NumberFormat>) => {
  return <NumberFormat {...props} suffix=" ₫" />;
};

export default VNDCurrency;
