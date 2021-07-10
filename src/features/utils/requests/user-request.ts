import axios, { Canceler } from "axios";
import { Boec, Position, Seasons, User } from "../../types";
import { get, patch, post, remove } from "../axiosConfig";
import { ListResponse, SuccessResponse } from "../types";

const CancelToken = axios.CancelToken;
let cancel: Canceler | undefined;

export const UsersAPI = {
    async getMeData(id: number): Promise<User> {
        const { data } = await get("/api/me/");
        return data;
    },
    async getList({
        limit,
        offset,
        search,
        brigadeId,
    }: {
        offset: number;
        limit: number;
        search?: string;
        brigadeId?: string;
    }): Promise<ListResponse<Boec>> {
        if (cancel) {
            cancel();
        }
        const params = {
            offset,
            limit,
            search,
            brigadeId,
        };

        const { data } = await get("/api/so/boec/", {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params,
        });
        return data;
    },
    async getUserData(id: string): Promise<Boec> {
        const { data } = await get(`/api/so/boec/${id}/`);
        return data;
    },
    async removeUser(id: number): Promise<Boec> {
        const { data } = await remove(`/api/so/boec/${id}/`);
        return data;
    },
    async getUserSeasons(userId: number): Promise<Seasons[]> {
        const { data } = await get(`/api/so/boec/${userId}/seasons/`);
        return data;
    },
    async getUserPositions(userId: number): Promise<Position[]> {
        const { data } = await get(`/api/so/boec/${userId}/positions/`);
        return data;
    },
    updateBoecData(data: Partial<Boec>): Promise<SuccessResponse<Boec, false>> {
        return patch(`/api/so/boec/${data.id}/`, data);
    },
    async createBoec(boec: Partial<Boec>): Promise<Boec> {
        const { data } = await post(`/api/so/boec/`, boec);
        return data;
    },
};
