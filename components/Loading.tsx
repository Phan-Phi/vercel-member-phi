import React from "react";
import { makeStyles } from "@mui/styles";
import { Box, Theme } from "@mui/material";

const useStyles = makeStyles((theme: Theme) => {
  return {
    "dots-3": {
      width: "50px",
      height: "28px",
      "--_g": `no-repeat radial-gradient(farthest-side,${theme.palette.primary2.main} 94%,#0000)`,
      background: "var(--_g) 50%  0,\n    var(--_g) 100% 0",
      backgroundSize: "12px 12px",
      position: "relative",
      animation: "$d3-0 1.5s linear infinite",
      ["&:before"]: {
        content: '""',
        position: "absolute",
        height: "12px",
        aspectRatio: "1",
        borderRadius: "50%",
        background: theme.palette.primary2.main,
        left: "0",
        top: "0",
        animation:
          "$d3-1 1.5s linear infinite,\n    $d3-2 0.5s cubic-bezier(0,200,.8,200) infinite",
      },
    },

    "@keyframes d3-0": {
      "0%,31%": { backgroundPosition: "50% 0   ,100% 0" },
      "33%": { backgroundPosition: "50% 100%,100% 0" },
      "43%,64%": { backgroundPosition: "50% 0   ,100% 0" },
      "66%": { backgroundPosition: "50% 0   ,100% 100%" },
      "79%": { backgroundPosition: "50% 0   ,100% 0" },
      "100%": { transform: "translateX(calc(-100%/3))" },
    },
    "@keyframes d3-1": { "100%": { left: "calc(100% + 7px)" } },
    "@keyframes d3-2": { "100%": { top: "-0.1px" } },
  };
});

const Loading = () => {
  const classes = useStyles();

  return (
    <Box justifyContent="center" display="flex" paddingY={2}>
      <div className={classes["dots-3"]}></div>
    </Box>
  );
};

export default Loading;
