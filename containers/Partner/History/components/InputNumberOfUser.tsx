import { InputNumber } from "components";

interface Props {
  value: number;
  label: string;
}

export default function InputNumberOfUser({ value, label }: Props) {
  return (
    <InputNumber
      readOnly={true}
      NumberFormatProps={{
        value: value,
      }}
      FormLabelProps={{
        children: label,
      }}
      InputProps={{
        sx: {
          WebkitTextFillColor: ({ palette }) => {
            return `${palette.primary2.main} !important`;
          },
        },
      }}
    />
  );
}
