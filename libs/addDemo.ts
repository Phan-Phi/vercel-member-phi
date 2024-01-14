import chunk from "lodash/chunk";

import axios from "../axios.config";

export default async (url: any) => {
  let resList: any = [];

  for await (let list of url) {
    const temp = await Promise.all(
      list.map(async (el: any) => {
        console.log("🚀 ~ list.map ~ el:", el);
        return await axios.get(el);
      })
    );

    resList = [...resList, ...temp];
  }

  return resList;
};
