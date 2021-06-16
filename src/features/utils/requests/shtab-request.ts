import axios, { Canceler } from "axios";
import { Shtab } from "../../types";
import { get } from "../axiosConfig";
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
};
