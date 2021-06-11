import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8000/",
});

instance.interceptors.request.use((config) => {
    const params = window.location.search.slice(1);

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
