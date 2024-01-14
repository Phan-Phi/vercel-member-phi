import React from "react";
import NextHead from "next/head";
import { useSetting } from "hooks";

export default function Head() {
  const setting = useSetting();
  return (
    <NextHead>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      {/* {process.env.NODE_ENV === "production" && (
          <meta
            httpEquiv="Content-Security-Policy"
            content="upgrade-insecure-requests"
          ></meta>
        )} */}
    </NextHead>
  );
}
