import axios, { Canceler } from "axios";
import { Boec, Brigade, Event, EventOrder, Seasons, Shtab } from "../types";
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
    getList({
        limit,
        offset,
        search,
        brigadeId,
    }: {
        offset: number;
        limit: number;
        search?: string;
        brigadeId?: string;
    }): Promise<SuccessResponse<Boec<true>, true>> {
        if (cancel) {
            cancel();
        }
        const params = {
            offset,
            limit,
            search,
            brigadeId,
        };

        return instance.get("/api/so/boec/", {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params,
        });
    },
    getUserData(id: string): Promise<SuccessResponse<Boec, false>> {
        return instance.get(`/api/so/boec/${id}/`);
    },
    updateBoecData(data: Partial<Boec>): Promise<SuccessResponse<Boec, false>> {
        return instance.patch(`/api/so/boec/${data.id}/`, data);
    },
    getBrigadesList(
        filter = { limit: 200, offset: 0 }
    ): Promise<SuccessResponse<Brigade, true>> {
        return instance.get(`/api/so/brigade/`, {
            params: filter,
        });
    },
    getSeason(id: string): Promise<SuccessResponse<Boec, false>> {
        return instance.get(`/api/so/boec/${id}/`);
    },
    updateSeason(
        data: Record<keyof Seasons, string>
    ): Promise<SuccessResponse<Record<keyof Seasons, string>, false>> {
        return instance.patch(`/api/so/season/${data.id}/`, data);
    },
    setSeason(
        data: Record<keyof Seasons, string>
    ): Promise<SuccessResponse<Record<keyof Seasons, string>, false>> {
        return instance.post(`/api/so/season/`, {
            ...data,
            brigade: undefined,
            brigade_id: data.brigade,
        });
    },
    deleteSeason(
        id: string
    ): Promise<SuccessResponse<Record<keyof Seasons, string>, false>> {
        return instance.delete(`/api/so/season/${id}/`);
    },
    getEvent(id: string): Promise<SuccessResponse<Event, false>> {
        return instance.get(`/api/event/${id}/`);
    },
    createEvent(data: Partial<Event>): Promise<SuccessResponse<Event, false>> {
        return instance.post(`/api/event/`, data);
    },
    getEventList({
        limit,
        offset,
        search,
    }: {
        offset: number;
        limit: number;
        search?: string;
    }): Promise<SuccessResponse<Event, true>> {
        if (cancel) {
            cancel();
        }
        const params = {
            offset,
            limit,
            search,
        };

        return instance.get("/api/event/", {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params,
        });
    },
    getShtabList(
        filter = { limit: 200, offset: 0 }
    ): Promise<SuccessResponse<Shtab, true>> {
        return instance.get(`/api/so/shtab/`, {
            params: filter,
        });
    },
    updateEvent(data: Partial<Event>): Promise<SuccessResponse<Event, false>> {
        return instance.patch(`/api/event/${data.id}/`, data);
    },
    toggleEventVisibility(id: number): Promise<SuccessResponse<Event, false>> {
        return instance.get(`/api/event/${id}/toggle/`);
    },
    getEventUsers(
        id: number,
        type: "volonteers" | "organizers"
    ): Promise<SuccessResponse<Boec<true>[], false>> {
        return instance.get(`/api/event/${id}/${type}/`);
    },
    getEventOrders(id: number): Promise<SuccessResponse<EventOrder[], false>> {
        return instance.get(`/api/event/${id}/orders/`);
    },
    getEventOrder(id: number): Promise<SuccessResponse<EventOrder, false>> {
        return instance.get(`/api/event/orders/${id}/`);
    },
    createOrder(
        data: Partial<EventOrder<true>>
    ): Promise<SuccessResponse<EventOrder, false>> {
        return instance.post(`/api/event/orders/`, data);
    },
    updateOrder(
        data: Partial<EventOrder<true>>
    ): Promise<SuccessResponse<EventOrder, false>> {
        return instance.patch(`/api/event/orders/${data.id}/`, data);
    },
};
