import queryString from "query-string";

type Params = [orignalUrl: string | undefined, addtionalParams: Record<string, unknown>];

type FunctionType = (...args: Params) => string;

export const transformUrl: FunctionType = (originalUrl, addtionalParams) => {
  if (originalUrl == undefined) {
    return "";
  }

  const { url, query: params } = queryString.parseUrl(originalUrl);

  const mergeParams = {
    ...params,
    ...addtionalParams,
  };

  return `${url}?${queryString.stringify(mergeParams)}`;
};
