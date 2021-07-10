import { Area, Brigade, Position, Seasons } from "../../types";
import { get, patch, post, remove } from "../axiosConfig";
import { ListResponse, SuccessResponse } from "../types";

export const BrigadesAPI = {
    async getAreas({ shtab }: { shtab?: number }): Promise<ListResponse<Area>> {
        const { data } = await get("/api/so/area/", { params: { shtab } });
        return data;
    },
    async getBrigade(brigadeId: number): Promise<Brigade> {
        const { data } = await get(`/api/so/brigade/${brigadeId}/`);
        return data;
    },
    async getBrigadesList({
        limit = 20,
        offset = 0,
        shtabId,
        search,
    }: {
        limit?: number;
        offset?: number;
        shtabId?: number;
        search?: string;
    }): Promise<ListResponse<Brigade>> {
        const params = {
            limit,
            offset,
            shtabId,
            search,
        };
        const { data } = await get(`/api/so/brigade/`, {
            params,
        });
        return data;
    },
    async getBrigadeSeasons({
        brigadeId,
    }: {
        brigadeId: number;
    }): Promise<Seasons[]> {
        const { data } = await get(`/api/so/brigade/${brigadeId}/seasons/`);
        return data;
    },
    async updateBrigade({
        id,
        DOB,
        title,
    }: {
        id: number;
        title: string;
        DOB: string | null;
    }): Promise<Brigade> {
        const { data } = await patch(`/api/so/brigade/${id}/`, {
            DOB,
            title,
        });
        return data;
    },
    async getBrigadePositions({
        brigadeId,
    }: {
        brigadeId: number;
    }): Promise<Position[]> {
        const { data } = await get(`/api/so/brigade/${brigadeId}/positions/`);
        return data;
    },
    async setBrigadePosition({
        boec,
        position,
        brigadeId,
    }: {
        boec: number;
        position: number;
        brigadeId: number;
    }): Promise<Position<false>> {
        const { data } = await post(`/api/so/brigade/${brigadeId}/positions/`, {
            boecId: boec,
            position,
        });
        return data;
    },
    async removeBrigadePosition({
        positionId,
        brigadeId,
    }: {
        positionId: number;
        brigadeId: number;
    }): Promise<Position<false>> {
        const { data } = await post(
            `/api/so/brigade/${brigadeId}/positions/${positionId}/remove/`
        );
        return data;
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
};
