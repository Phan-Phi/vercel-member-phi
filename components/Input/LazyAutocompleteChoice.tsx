import { useToggle } from "react-use";

import { CircularProgress, Autocomplete, AutocompleteProps, Box } from "@mui/material";

import InputForAutocomplete from "./InputForAutocomplete";

interface Props {
  data: any;
  url?: string;
  label?: React.ReactNode;
  placeholder?: string;
  AutocompleteProps?: any;
}

const LazyAutocompleteChoice = (props: Props) => {
  const { data, placeholder, AutocompleteProps = {}, label } = props;

  const [open, toggle] = useToggle(false);

  return (
    <Autocomplete
      fullWidth={true}
      open={open}
      onOpen={() => toggle(true)}
      onClose={() => toggle(false)}
      options={data}
      disableCloseOnSelect={false}
      includeInputInList={true}
      filterSelectedOptions={true}
      renderInput={(props) => {
        return (
          <InputForAutocomplete label={label} placeholder={placeholder} {...props} />
        );
      }}
      loadingText={
        <Box display="flex" justifyContent="center">
          <CircularProgress size={20} />
        </Box>
      }
      {...AutocompleteProps}
    />
  );
};

export default LazyAutocompleteChoice;
