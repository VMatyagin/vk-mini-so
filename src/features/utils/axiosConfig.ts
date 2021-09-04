import axios from "axios";
import { AppStoreInstance } from "../stores/app-store";
// import { getAuthorization } from "./getAuthorization";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
instance.interceptors.request.use((config) => {
  const params = AppStoreInstance.queryString;

  // we send location string without any changes

  if (params) {
    config.headers["Authorization"] = params;
  }
  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export const get = instance.get;
export const post = instance.post;
export const put = instance.put;
export const remove = instance.delete;
export const patch = instance.patch;
