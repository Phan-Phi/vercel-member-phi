import pick from "lodash/pick";
import { AxiosRequestConfig } from "axios";

import axios from "axios.config";
import { CONVERT_DIVISIONS } from "apis";

import { transformUrl } from "libs";

import { ProvinceTuple, DistrictTuple, WardTuple } from "interfaces";

interface ReturnTypeProps {
  ward: WardTuple;
  district: DistrictTuple;
  province: ProvinceTuple;
}

export const convertValueToTupleForAddress = async <
  T extends { province: string; district?: string; ward?: string }
>(
  data: T,
  options?: AxiosRequestConfig
): Promise<ReturnTypeProps | undefined> => {
  const body = pick(data, ["province", "district", "ward"]);

  try {
    const { data: resData } = await axios.get<
      [ward: string, district: string, province: string]
    >(transformUrl(CONVERT_DIVISIONS, body), options);

    let newObj: ReturnTypeProps = {} as ReturnTypeProps;

    newObj.ward = [body["ward"] ?? "", resData[0]];
    newObj.district = [body["district"] ?? "", resData[1]];
    newObj.province = [body["province"] ?? "", resData[2]];

    return newObj;
  } catch (err) {}
};
