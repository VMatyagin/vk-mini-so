import axios, { Canceler } from "axios";
import { Boec } from "../types";
import { SuccessResponse } from "./types";

const instance = axios.create({
    baseURL: "http://localhost:8000/",
});

const CancelToken = axios.CancelToken;
let cancel: Canceler | undefined;

instance.interceptors.request.use((config) => {
    const token = window.localStorage.getItem("token");
    if (true || token) {
        config.headers[
            "Authorization"
        ] = `vk_user_id=admin&vk_app_id=6736218&vk_is_app_user=1&vk_are_notifications_enabled=1&vk_language=ru&vk_access_token_settings=&vk_platform=android&sign=htQFduJpLxz7ribXRZpDFUH-XEUhC9rBPTJkjUFEkRA`;
    }
    if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
    }
    return config;
});

export const SoAPI = {
    async getList({
        limit,
        offset,
        search,
    }: {
        offset: number;
        limit: number;
        search?: string;
    }): Promise<SuccessResponse<Boec<true>, true>> {
        if (cancel) {
            cancel();
        }
        const params = {
            offset,
            limit,
            search,
        };

        return instance.get("/api/so/boec/", {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params,
        });
    },
    async getUserData(id: string): Promise<SuccessResponse<Boec, false>> {
        return instance.get(`/api/so/boec/${id}/`);
    },
    async updateBoecData(
        data: Partial<Boec>
    ): Promise<SuccessResponse<Boec, false>> {
        return instance.put(`/api/so/boec/${data.id}/`, data);
    },
};
