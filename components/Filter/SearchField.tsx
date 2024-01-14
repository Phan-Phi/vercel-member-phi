import { useDebounce, useUpdateEffect } from "react-use";
import { Input, InputProps, Stack, styled } from "@mui/material";
import { useCallback, ChangeEventHandler, useRef, useState } from "react";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import BoxWithShadow from "components/BoxWithShadow";

type Props = {
  initSearch?: string;
  isShadow?: boolean;
  InputProps?: InputProps;
  onChange?: (searchText: string | undefined) => void;
};

const SearchField = (props: Props) => {
  const isFirstRun = useRef(true);
  const { isShadow = true, InputProps, onChange, initSearch = "" } = props;
  const [searchText, setSearchText] = useState<string | undefined>("");

  useDebounce(
    () => {
      if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
      }

      onChange?.(searchText);
    },
    500,
    [searchText]
  );

  useUpdateEffect(() => {
    setSearchText(initSearch);
  }, [initSearch]);

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  return (
    <BoxWithShadow padding={1.5} {...(!isShadow && { boxShadow: 0 })}>
      <Stack
        flexDirection={"row"}
        justifyContent="center"
        alignItems={"center"}
        columnGap={1.5}
      >
        <SearchOutlinedIcon />
        <StyledInput
          placeholder="Tìm kiếm..."
          value={searchText}
          onChange={onChangeHandler}
          {...InputProps}
        />
      </Stack>
    </BoxWithShadow>
  );
};

const StyledInput = styled(Input)({
  flexGrow: 1,
});

export default SearchField;
