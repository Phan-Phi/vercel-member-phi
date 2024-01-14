import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import React, { Fragment, memo, useCallback, useMemo } from "react";
import { Typography, SvgIcon, Stack, MenuItem } from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { usePopupState, bindHover, bindPopover } from "material-ui-popup-state/hooks";

import Link from "components/Link";
import Container from "components/Container";
import { ROUTES, RouteItemProps } from "routes";
import { usePermission } from "hooks/usePermission";

const Navbar = () => {
  const { status } = useSession();
  const { userPermission } = usePermission();

  const renderNavbar = useMemo(() => {
    if (status !== "authenticated") return null;

    return (
      <Container>
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            boxShadow: 4,
            padding: 1.5,
            borderRadius: 2,
          }}
        >
          {ROUTES.map((el, idx) => {
            return <RouteItem key={idx} data={el} />;
          })}
        </Stack>
      </Container>
    );
  }, [status, userPermission]);

  return renderNavbar;
};

const RouteItem = memo(function RouteItem({ data }: { data: RouteItemProps }) {
  const router = useRouter();
  const { userPermission } = usePermission();

  const { label, icon, route, routes, codename } = data;

  const popupState = usePopupState({ variant: "popover", popupId: label });

  const { isOpen } = popupState;

  const onGotoHandler = useCallback((route) => {
    return () => {
      router.push(route);
    };
  }, []);

  const mergeRoute = useMemo(() => {
    const routeList: string[] = [];

    if (route) {
      routeList.push(route);
    }

    if (routes) {
      routes.forEach((el) => {
        routeList.push(el.route);
      });
    }

    return routeList;
  }, []);

  //TODO: FIX LATER
  // if (codename == undefined) return null;
  // userPermission.includes(codename) || codename === "general"

  if (true) {
    return (
      <Fragment>
        <Link
          href={route ? route : "#"}
          onClick={(e) => {
            e.preventDefault();
            if (route == undefined) return;
            router.push(route);
          }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: mergeRoute.reduce((result, el) => {
              if (result) return result;

              if (router.pathname === "/" && el === "/") return true;

              if (el === "/") return false;

              return router.pathname.includes(el);
            }, false)
              ? "primary2"
              : "common.black",
          }}
          {...bindHover(popupState)}
        >
          {icon && <SvgIcon component={icon} color={isOpen ? "primary2" : undefined} />}

          <Typography
            marginLeft={1}
            marginRight={1}
            color={isOpen ? "primary2.main" : "currentcolor"}
          >
            {label}
          </Typography>

          {routes && <ExpandMoreOutlinedIcon color={isOpen ? "primary2" : undefined} />}
        </Link>

        {routes && (
          <HoverPopover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            PaperProps={{
              sx: {
                paddingY: 2,
              },
            }}
            disableScrollLock={true}
          >
            {routes.map((el, idx) => {
              //TODO: FIX LATER
              // el.codename && userPermission.includes(el.codename);

              if (true) {
                return (
                  <MenuItem
                    key={idx}
                    sx={{
                      fontWeight: 300,
                    }}
                    onClick={onGotoHandler(el.route)}
                  >
                    {el.label}
                  </MenuItem>
                );
              }

              return null;

              // return (
              //   <MenuItem
              //     key={idx}
              //     sx={{
              //       fontWeight: 300,
              //     }}
              //     onClick={onGotoHandler(el.route)}
              //   >
              //     {el.label}
              //   </MenuItem>
              // );
            })}
          </HoverPopover>
        )}
      </Fragment>
    );
  }

  return null;
});

export default Navbar;
