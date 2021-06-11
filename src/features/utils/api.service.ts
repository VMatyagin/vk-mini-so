import axios, { Canceler } from "axios";
import { Boec, Event, EventOrder, Seasons, Shtab } from "../types";
import { get, patch, post, remove } from "./axiosConfig";
import { SuccessResponse } from "./types";

const CancelToken = axios.CancelToken;
let cancel: Canceler | undefined;

export const SoAPI = {
    updateBoecData(data: Partial<Boec>): Promise<SuccessResponse<Boec, false>> {
        return patch(`/api/so/boec/${data.id}/`, data);
    },

    updateSeason({
        brigadeId,
        boecId,
        id,
        year,
    }: {
        brigadeId: number;
        boecId: number;
        id: number;
        year: number;
    }): Promise<SuccessResponse<Seasons>> {
        return patch(`/api/so/season/${id}/`, {
            brigadeId,
            boecId,
            year,
        });
    },
    setSeason({
        brigadeId,
        boecId,
        year,
    }: {
        brigadeId: number;
        boecId: number;
        year: number;
    }): Promise<SuccessResponse<Seasons>> {
        return post(`/api/so/season/`, {
            brigadeId,
            boecId,
            year,
        });
    },
    deleteSeason(id: number): Promise<SuccessResponse<Seasons>> {
        return remove(`/api/so/season/${id}/`);
    },
    getEvent(id: string): Promise<SuccessResponse<Event, false>> {
        return get(`/api/event/${id}/`);
    },
    createEvent(data: Partial<Event>): Promise<SuccessResponse<Event, false>> {
        return post(`/api/event/`, data);
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

        return get("/api/event/", {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params,
        });
    },
    getShtabList(
        filter = { limit: 200, offset: 0 }
    ): Promise<SuccessResponse<Shtab, true>> {
        return get(`/api/so/shtab/`, {
            params: filter,
        });
    },
    updateEvent(data: Partial<Event>): Promise<SuccessResponse<Event, false>> {
        return patch(`/api/event/${data.id}/`, data);
    },
    removeEvent(id: number): Promise<undefined> {
        return remove(`/api/event/${id}/`);
    },
    toggleEventVisibility(id: number): Promise<SuccessResponse<Event, false>> {
        return get(`/api/event/${id}/toggle/`);
    },
    getEventUsers(
        id: number,
        type: "volonteers" | "organizers"
    ): Promise<SuccessResponse<Boec[], false>> {
        return get(`/api/event/${id}/${type}/`);
    },
    getEventOrders(id: number): Promise<SuccessResponse<EventOrder[], false>> {
        return get(`/api/event/${id}/orders/`);
    },
    getEventOrder(id: number): Promise<SuccessResponse<EventOrder, false>> {
        return get(`/api/event/orders/${id}/`);
    },
    createOrder(
        data: Partial<EventOrder<true>>
    ): Promise<SuccessResponse<EventOrder, false>> {
        return post(`/api/event/orders/`, data);
    },
    updateOrder(
        data: Partial<EventOrder<true>>
    ): Promise<SuccessResponse<EventOrder, false>> {
        return patch(`/api/event/orders/${data.id}/`, data);
    },
    addEventUser(
        id: number,
        type: "volonteers" | "organizers",
        userId: number,
        params?: Record<string, string>
    ): Promise<SuccessResponse<Boec[], false>> {
        return post(
            `/api/event/${id}/${type}/`,
            {
                id: userId,
            },
            { params }
        );
    },
    removeEventUser(
        id: number,
        type: "volonteers" | "organizers",
        userId: number
    ): Promise<SuccessResponse<Boec[], false>> {
        return this.addEventUser(id, type, userId, {
            isRemove: "1",
        });
    },
};
