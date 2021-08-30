import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
instance.interceptors.request.use((config) => {
  // const params = window.location.search.slice(1);

  // we send location string without any changes

  if (true) {
    config.headers["Authorization"] =
      "vk_access_token_settings=groups&vk_app_id=7913375&vk_are_notifications_enabled=1&vk_is_app_user=1&vk_is_favorite=1&vk_language=ru&vk_platform=mobile_web&vk_ref=other&vk_ts=1629029589&vk_user_id=42850349&sign=ZwWFr3VZ3SBnt0Au467p9o5wVJ-sZi-Uq4QoOPsK5dI";
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
