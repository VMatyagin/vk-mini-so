import axios, { Canceler } from "axios";
import { Position, Shtab } from "../../types";
import { get, patch, post, remove } from "../axiosConfig";
import { ListResponse } from "../types";

const CancelToken = axios.CancelToken;
let cancel: Canceler | undefined;

export const ShtabsAPI = {
    async getShtabs({
        limit = 20,
        offset,
    }: {
        offset?: number;
        limit?: number;
    }): Promise<ListResponse<Shtab>> {
        if (cancel) {
            cancel();
        }
        const params = {
            offset,
            limit,
        };

        const { data } = await get("/api/so/shtab/", {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params,
        });
        return data;
    },
    async getShtab(shtabId: number): Promise<Shtab> {
        const { data } = await get(`/api/so/shtab/${shtabId}/`);
        return data;
    },
    async getShtabPositions({
        shtabId,
        hideLast,
    }: {
        shtabId: number;
        hideLast?: boolean;
    }): Promise<Position[]> {
        const params = { hideLast };
        const { data } = await get(`/api/so/shtab/${shtabId}/positions/`, {
            params,
        });
        return data;
    },
    async updateShtab({ id, ...rest }: Shtab): Promise<Shtab> {
        const { data } = await patch(`/api/so/shtab/${id}/`, rest);
        return data;
    },
    async setShtabPosition({
        boec,
        position,
        shtabId,
    }: {
        boec: number;
        position: number;
        shtabId: number;
    }): Promise<Position<false>> {
        const { data } = await post(`/api/so/shtab/${shtabId}/positions/`, {
            boecId: boec,
            position,
        });
        return data;
    },
    async removeShtabPosition({
        positionId,
        shtabId,
    }: {
        positionId: number;
        shtabId: number;
    }): Promise<Position> {
        const { data } = await remove(
            `/api/so/shtab/${shtabId}/positions/${positionId}/`
        );
        return data;
    },
    async updateShtabPosition(position: Position): Promise<Position> {
        const { id, brigade, shtab, ...rest } = position;
        const { data } = await patch(
            `/api/so/shtab/${shtab.id}/positions/${id}/`,
            rest
        );
        return data;
    },
};
