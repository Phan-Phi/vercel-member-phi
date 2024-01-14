import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { SvgIconComponent } from "@mui/icons-material";
import React, { Fragment, useCallback, useMemo } from "react";
import { usePopupState, bindToggle, bindPopover } from "material-ui-popup-state/hooks";

import get from "lodash/get";

import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";

import {
  Box,
  Grid,
  Menu,
  Stack,
  styled,
  Avatar,
  SvgIcon,
  MenuItem,
  Typography,
} from "@mui/material";

import Link from "components/Link";
import Image from "components/Image";
import Container from "components/Container";

type ItemProps = {
  label: string;
  route?: string;
  icon: SvgIconComponent;
  onClick?: () => void;
};

const LIST_ITEM: ItemProps[] = [
  {
    label: "Đổi mật khẩu",
    route: "/doi-mat-khau",
    icon: ManageAccountsOutlinedIcon,
  },
  {
    label: "Đăng xuất",
    onClick: () => {
      signOut();
    },
    icon: LogoutOutlinedIcon,
  },
];

const Header = () => {
  const router = useRouter();
  const { status, data } = useSession();

  const popupState = usePopupState({ variant: "popover", popupId: "avatar" });

  const onGotoHandler = useCallback(
    (route: string) => {
      return () => {
        router.push(route);
        popupState.close();
      };
    },
    [router, popupState]
  );

  const renderAppbar = useMemo(() => {
    if (status === "authenticated") {
      const email = get(data, "user.email");

      if (typeof email === "string") {
        return (
          <Fragment>
            <Stack
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
              columnGap={1}
            >
              <Typography>{email}</Typography>

              <Avatar
                {...bindToggle(popupState)}
                sx={{
                  cursor: "pointer",
                }}
              />
            </Stack>

            <Menu
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
                  paddingY: 1,
                },
              }}
            >
              {LIST_ITEM.map((el, idx) => {
                let onClick = () => {};

                if (el.route) {
                  onClick = onGotoHandler(el.route);
                } else if (el.onClick) {
                  onClick = el.onClick;
                }

                return (
                  <MenuItem key={idx} onClick={onClick}>
                    <SvgIcon component={el.icon} />

                    <Typography paddingLeft={1} fontWeight={300}>
                      {el.label}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Menu>
          </Fragment>
        );
      } else {
        return null;
      }
    }

    return null;
  }, [status, data, popupState, onGotoHandler]);

  return (
    <Container>
      <Grid container>
        <Grid item xs={12}>
          <StyledBox>
            <Link href="/">
              <Image
                src={"/logo.png"}
                alt="Logo"
                width={60}
                height={60}
                objectFit="contain"
              />
            </Link>
            {renderAppbar}
          </StyledBox>
        </Grid>
      </Grid>
    </Container>
  );
};

const StyledBox = styled(Box)(({ theme }) => {
  return {
    paddingTop: 8,
    paddingBottom: 8,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };
});

export default Header;
