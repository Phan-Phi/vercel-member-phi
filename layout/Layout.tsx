import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Box, styled } from "@mui/material";
import { useSession } from "next-auth/react";

import isEmpty from "lodash/isEmpty";

import Header from "components/Header";
import Navbar from "components/Navbar";

import { Loading, Spacing } from "components";
import { useChoice, useSetting } from "hooks";

import { UNAUTH_ROUTES } from "routes";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const choice = useChoice();
  const setting = useSetting();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated" && !UNAUTH_ROUTES.includes(router.pathname)) {
      router.replace("/dang-nhap");
    }

    if (status === "authenticated" && UNAUTH_ROUTES.includes(router.pathname)) {
      router.replace("/");
    }
  }, [status, router.pathname]);

  if (status === "loading" || isEmpty(choice)) {
    return (
      <StyledBox
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading />
      </StyledBox>
    );
  }

  return (
    <StyledBox>
      <Header />

      <Navbar />

      {status === "authenticated" && <Spacing spacing={3} />}

      {status === "authenticated" && !isEmpty(setting) && children}

      {status !== "authenticated" && UNAUTH_ROUTES.includes(router.pathname) && children}

      {status === "authenticated" && <Spacing spacing={3} />}
    </StyledBox>
  );
};

const StyledBox = styled(Box)(() => {
  return {
    minHeight: "100vh",
    overflow: "hidden",
  };
});

export default Layout;
