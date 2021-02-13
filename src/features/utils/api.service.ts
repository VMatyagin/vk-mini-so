import axios, { Canceler } from "axios";
import { Boec } from "../types";
import { LoginResponse, SuccessResponse } from "./types";

const instance = axios.create({
    baseURL: "http://localhost:8000/",
});

const CancelToken = axios.CancelToken;
let cancel: Canceler | undefined;

instance.interceptors.request.use((config) => {
    const token = window.localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = `Token ${token}`;
    }
    if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
    }
    return config;
});

export const AuthAPI = {
    async login(
        formData: Record<"email" | "password", string>
    ): Promise<SuccessResponse<LoginResponse>> {
        return instance.post("/api/user/token", formData);
    },
    async forgot(formData: Record<string, string>) {
        return instance.post("/api/v1/user/restore-password", formData);
    },
};

export const SoAPI = {
    async getList({
        limit,
        offset,
    }: {
        offset: number;
        limit: number;
    }): Promise<SuccessResponse<Boec, true>> {
        if (cancel) {
            cancel();
        }
        const params = {
            offset,
            limit,
        };
        console.log(limit);
        
        return instance.get("/api/so/boec", {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params,
        });
    },
};
