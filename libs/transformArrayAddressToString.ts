import set from "lodash/set";

import { ChoiceItem } from "interfaces";

type TransformArrayAddressToStringProps = {
  province: ChoiceItem | null;
  district: ChoiceItem | null;
  ward: ChoiceItem | null;
  [key: string]: any;
};
const transformArrayAddressToString = (data: TransformArrayAddressToStringProps) => {
  const province = data.province;
  const district = data.district;
  const ward = data.ward;

  if (province) {
    const [value] = province;
    set(data, "province", value);
  }

  if (district) {
    const [value] = district;
    set(data, "district", value);
  }

  if (ward) {
    const [value] = ward;
    set(data, "ward", value);
  }

  return data;
};

export { transformArrayAddressToString };
