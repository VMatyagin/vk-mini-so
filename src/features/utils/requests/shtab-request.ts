import { Shtab } from "../../types";
import { get } from "../axiosConfig";
import { ListResponse } from "../types";

export const ShtabsAPI = {
    async getShtabs(): Promise<ListResponse<Shtab>> {
        const { data } = await get("/api/so/shtab/");
        return data;
    },
    async getShtab(shtabId: number): Promise<Shtab> {
        const { data } = await get(`/api/so/shtab/${shtabId}/`);
        return data;
    },
};
