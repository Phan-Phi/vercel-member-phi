import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme, alpha } from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

enum COLOR {
  PRIMARY_1 = "#EE4F2D",
  PRIMARY_2 = "#1074BA",
  PRIMARY_LIGHT_2 = "#3F8FC7",
  PRIMARY_DARK_2 = "#0B5182",
  BLACK = "#2B2B2B",
  WHITE = "#FFFFFF",
}

const fontFamily = [
  "Roboto ",
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  '"Helvetica Neue"',
  "Arial",
  "sans-serif",
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
].join(",");

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: COLOR.PRIMARY_1,
    },
    secondary: {
      main: COLOR.PRIMARY_2,
    },
    primary2: {
      main: COLOR.PRIMARY_2,
      light: COLOR.PRIMARY_LIGHT_2,
      dark: COLOR.PRIMARY_DARK_2,
      contrastText: COLOR.WHITE,
    },
    common: {
      black: COLOR.BLACK,
      white: COLOR.WHITE,
    },
    error: {
      main: COLOR.PRIMARY_1,
    },
    text: {
      primary: COLOR.BLACK,
    },
  },
  typography: {
    fontFamily,
    h1: {
      fontSize: 36,
      fontWeight: 700,
      lineHeight: "42.19px",
      letterSpacing: 36 * 0.02,
    },
    h2: {
      fontSize: 30,
      fontWeight: 700,
      lineHeight: "35.16px",
      letterSpacing: 30 * 0.02,
    },
    h3: {
      fontSize: 20,
      fontWeight: 400,
      lineHeight: "23.44px",
      letterSpacing: 20 * 0.02,
    },
    body1: {
      fontSize: 16,
      fontWeight: 400,
      lineHeight: "18.75px",
      letterSpacing: 16 * 0.02,
    },
    body2: {
      fontSize: 14,
      fontWeight: 400,
      lineHeight: "16.41px",
      letterSpacing: 14 * 0.02,
    },
    subtitle1: {
      fontSize: 12,
      fontWeight: 400,
      lineHeight: "14px",
      letterSpacing: 14 * 0.02,
    },
  },
});

const theme = createTheme({
  ...defaultTheme,

  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
        variant: "contained",
        color: "primary2",
      },
      styleOverrides: {
        // root: {
        //   "&:active": {
        //     backgroundColor: defaultTheme.palette.primary2.light,
        //   },
        //   "&:focus": {
        //     backgroundColor: defaultTheme.palette.primary2.light,
        //   },
        // },

        text: {
          transition: `color ${defaultTheme.transitions.duration.standard}ms ${defaultTheme.transitions.easing.easeOut}`,
          "&:hover": {
            backgroundColor: "unset",
            color: defaultTheme.palette.primary.dark,
          },
        },
      },
    },
    MuiIconButton: {
      defaultProps: {},
      styleOverrides: {
        root: {
          borderRadius: "0.25rem",
          transition: `opacity ${defaultTheme.transitions.duration.short}ms ${defaultTheme.transitions.easing.easeOut}`,
          marginRight: 0,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginTop: "0.25rem",
          marginRight: 0,
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          marginTop: "0 !important",
          borderWidth: "0.0625rem",
          borderColor: defaultTheme.palette.grey[300],
          borderStyle: "solid",
          borderRadius: "0.25rem",

          ["&.Mui-error"]: {
            borderColor: defaultTheme.palette.error.main,
          },

          ["& input"]: {
            padding: "0.5rem",
            "&::placeholder": {
              color: defaultTheme.palette.grey[500],
              ...defaultTheme.typography.subtitle1,
            },
          },
        },
      },
      defaultProps: {
        disableUnderline: true,
      },
    },
    MuiFormControl: {
      defaultProps: {
        fullWidth: true,
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input::-webkit-scrollbar": {
            display: "none !important",
          },

          // "&::webkit-scrollbar": {
          //   display: "flex",
          // },
        },
      },
    },

    MuiFormLabel: {
      styleOverrides: {
        root: {
          ...defaultTheme.typography.subtitle2,
          color: defaultTheme.palette.text.primary,
          transition: `all ${defaultTheme.transitions.duration.short}ms ${defaultTheme.transitions.easing.easeOut}`,
        },
      },
      defaultProps: {
        color: "primary2",
      },
    },
    MuiTypography: {},
    MuiLink: {
      defaultProps: {
        color: defaultTheme.palette.primary2.main,
      },
      styleOverrides: {
        root: {
          textDecoration: "none",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          [":hover"]: {
            backgroundColor: defaultTheme.palette.primary2.main,
            color: defaultTheme.palette.common.white,
            borderRadius: 4,
          },
          ["&.Mui-selected"]: {
            backgroundColor: alpha(defaultTheme.palette.primary2.main, 0.08),

            ["&:hover"]: {
              backgroundColor: alpha(defaultTheme.palette.primary2.main, 0.12),
            },
            ["&.Mui-focusVisible"]: {
              backgroundColor: alpha(defaultTheme.palette.primary2.main, 0.12),
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {},
      defaultProps: {
        color: "primary2",
      },
    },
    MuiRadio: {
      defaultProps: {
        color: "primary2",
      },
    },
    MuiGrid: {
      defaultProps: {
        spacing: 3,
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          ["& .MuiAutocomplete-option"]: {
            backgroundColor: "blue !important",
          },
        },

        inputRoot: {
          ["& input"]: {
            padding: "8px !important",
          },
        },
        option: {
          ["&:hover"]: {
            backgroundColor: `${defaultTheme.palette.primary2.main} !important`,
            color: defaultTheme.palette.common.white,
            borderRadius: 4,
          },
          [`&[aria-selected="true"]`]: {
            backgroundColor: `${alpha(
              defaultTheme.palette.primary2.main,
              0.12
            )} !important`,
          },
        },
        endAdornment: {
          right: 8,
        },
      },
      defaultProps: {
        popupIcon: <ExpandMoreIcon />,
      },
    },
    MuiCircularProgress: {
      defaultProps: {
        color: "primary2",
      },
    },
    MuiSelect: {
      defaultProps: {
        IconComponent: ExpandMoreIcon,
      },
    },
    MuiTab: {
      defaultProps: {},
    },
    MuiTabs: {
      defaultProps: {
        textColor: "secondary",
        indicatorColor: "secondary",
      },
      styleOverrides: {},
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: "xl",
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          backgroundColor: defaultTheme.palette.common.white,
          ["&:nth-of-type(odd):not(.MuiTableRow-head)"]: {
            backgroundColor: defaultTheme.palette.grey["100"],
          },
          ["& td[data-sticky-td]"]: {
            backgroundColor: defaultTheme.palette.common.white,
          },
          ["& [data-sticky-first-right-td]"]: {
            boxShadow: `-2px 0 3px ${defaultTheme.palette.grey["300"]}`,
          },
          ["& th[data-sticky-td]"]: {
            zIndex: "4 !important",
          },
          ["&:nth-of-type(odd):not(.MuiTableRow-head) td[data-sticky-td]"]: {
            backgroundColor: defaultTheme.palette.grey["100"],
          },
        },
      },
    },
  },
});

type ThemeProps = {
  children: React.ReactNode;
};

const Theme = ({ children }: ThemeProps) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
      <CssBaseline />
    </ThemeProvider>
  );
};

export default Theme;
