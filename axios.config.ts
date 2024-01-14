import axios, { AxiosError } from "axios";
import { getSession } from "next-auth/react";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});
instance.interceptors.request.use(
  async function (config) {
    const url = config.url;

    const session = await getSession();

    if (session) {
      const { user } = session;

      const token = user.token;

      if (!config?.headers?.Authorization && config.headers) {
        config.headers.Authorization = `JWT ${token}`;
      }
    }
    if (url == undefined) return config;

    return {
      ...config,
      baseURL: url.includes("collections")
        ? process.env.NEXT_PUBLIC_CHECK_VERSION_URL
        : process.env.NEXT_PUBLIC_BASE_URL,
    };
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (err: AxiosError) {
    return Promise.reject(err);
  }
);

export default instance;
