import { useState, Fragment, useCallback } from "react";
import { Controller, Control, Path } from "react-hook-form";

import {
  CircularProgress,
  Autocomplete,
  FormHelperText,
  AutocompleteProps,
  FormLabelProps,
  FormControlProps,
  FormHelperTextProps,
  FormControl,
  InputProps,
  AutocompleteInputChangeReason,
} from "@mui/material";

import { debounce, get, throttle } from "lodash";

import { useToggle, useFetchInfinite } from "hooks";

import { transformUrl } from "libs";
import InputBase from "./InputBase";
import FormLabel from "./FormLabel";

type CommonProps<V extends object> = {
  url?: string;
  label?: string;
  placeholder?: string;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  AutocompleteProps?: Omit<
    AutocompleteProps<V, undefined, undefined, undefined>,
    "renderInput" | "options" | "ListboxProps"
  >;
  FormHelperTextProps?: FormHelperTextProps;
  params?: {
    [key: string]: any;
  };
  shouldSearch?: boolean;
  InputProps?: InputProps;
};

type ConditionalProps<T extends object, V extends object> =
  | {
      control: Control<T, any>;
      name: Path<T>;
      initValue?: never;
    }
  | {
      control?: undefined;
      name?: never;
      initValue?: V | null;
    };

type Props<T extends object, V extends object> = CommonProps<V> & ConditionalProps<T, V>;

const LazyAutocomplete = <T extends object, V extends object>(props: Props<T, V>) => {
  const { url } = props;

  if (!url) return null;

  return <RootComponent {...props} />;
};

const RootComponent = <T extends object, V extends object>(props: Props<T, V>) => {
  const {
    name,
    control,
    url,
    placeholder,
    params: additionalParams,
    AutocompleteProps = {},
    FormControlProps,
    FormHelperTextProps,
    FormLabelProps,
    label,
    InputProps,
    initValue,
  } = props;

  const { onOpen, onClose } = useToggle();
  const [searchStr, setSearchStr] = useState("");
  const [selectedValue, setSelectedValue] = useState<V | null | undefined>(initValue);

  const { data, isLoading, fetchNextPage, isDone } = useFetchInfinite(
    (pageIdx, prevData) => {
      const initParams = {
        limit: 10,
        search: searchStr,
        ...additionalParams,
      };

      if (pageIdx === 0) return transformUrl(url, initParams);

      if (prevData == null) return transformUrl(url, initParams);

      return prevData.next;
    }
  );

  const onScrollHandler = useCallback(
    throttle((e: React.UIEvent<HTMLUListElement>) => {
      if (isDone) return;

      if (isLoading) return;

      const scrollTop = get(e, "target.scrollTop");
      const offsetHeight = get(e, "target.offsetHeight");
      const scrollHeight = get(e, "target.scrollHeight");

      const ratio = (scrollTop + offsetHeight) / scrollHeight;

      if (ratio > 0.98) fetchNextPage();
    }, 300),
    [isLoading, isDone]
  );

  const onInputChangeHandler = useCallback(
    debounce(
      (
        e: React.SyntheticEvent<Element, Event>,
        value: string,
        reason: AutocompleteInputChangeReason
      ) => {
        setSearchStr(value);
      },
      300
    ),
    []
  );

  if (control && name && AutocompleteProps) {
    return (
      <Controller
        name={name}
        control={control}
        render={(props) => {
          const {
            field: { value, onChange },
            fieldState: { error },
          } = props;

          return (
            <Autocomplete
              fullWidth={true}
              onOpen={onOpen}
              onClose={onClose}
              options={data || []}
              loading={isLoading}
              disableCloseOnSelect={false}
              includeInputInList={true}
              filterSelectedOptions={true}
              noOptionsText="Không có dữ liệu"
              ListboxProps={{
                onScroll: onScrollHandler,
              }}
              onInputChange={onInputChangeHandler}
              renderInput={(params) => {
                return (
                  <FormControl {...FormControlProps} id={params.id} error={!!error}>
                    <FormLabel {...FormLabelProps}>{label}</FormLabel>
                    <InputBase
                      placeholder={placeholder}
                      {...InputProps}
                      {...params.InputProps}
                      inputProps={params.inputProps}
                      endAdornment={
                        <Fragment>
                          {isLoading ? (
                            <CircularProgress size={20} sx={{ marginRight: 1 }} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </Fragment>
                      }
                      size={params.size}
                    />
                    <FormHelperText {...FormHelperTextProps}>
                      {error?.message}
                    </FormHelperText>
                  </FormControl>
                );
              }}
              value={value as V | null | undefined}
              onChange={(_, value) => {
                onChange(value);
              }}
              loadingText={<CircularProgress size={20} />}
              {...AutocompleteProps}
            />
          );
        }}
      />
    );
  } else if (typeof selectedValue === "object") {
    return (
      <Autocomplete
        fullWidth={true}
        onOpen={onOpen}
        onClose={onClose}
        options={data || []}
        loading={isLoading}
        disableCloseOnSelect={false}
        includeInputInList={true}
        filterSelectedOptions={true}
        noOptionsText="Không có dữ liệu"
        ListboxProps={{
          onScroll: onScrollHandler,
        }}
        onInputChange={onInputChangeHandler}
        renderInput={(params) => {
          return (
            <FormControl {...FormControlProps} id={params.id}>
              <FormLabel {...FormLabelProps}>{label}</FormLabel>
              <InputBase
                placeholder={placeholder}
                {...InputProps}
                {...params.InputProps}
                inputProps={params.inputProps}
                endAdornment={
                  <Fragment>
                    {isLoading ? (
                      <CircularProgress size={20} sx={{ marginRight: 1 }} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </Fragment>
                }
                size={params.size}
              />
              <FormHelperText {...FormHelperTextProps} />
            </FormControl>
          );
        }}
        loadingText={<CircularProgress size={20} />}
        {...AutocompleteProps}
        value={selectedValue}
        onChange={(event, value, reason, details) => {
          setSelectedValue(value);
          AutocompleteProps?.onChange?.(event, value, reason, details);
        }}
      />
    );
  }

  return null;
};

export default LazyAutocomplete;
