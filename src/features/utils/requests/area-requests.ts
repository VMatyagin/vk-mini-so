import axios, { Canceler } from "axios";
import { Area } from "../../types";
import { get } from "../axiosConfig";
import { ListResponse } from "../types";

const CancelToken = axios.CancelToken;
let cancel: Canceler | undefined;

export const AreaAPI = {
  async getAreas({
    limit = 20,
    offset,
    search,
  }: {
    offset?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<ListResponse<Area>> {
    if (cancel) {
      cancel();
    }
    const params = {
      offset,
      limit,
      search,
    };

    const { data } = await get("/api/area/", {
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      }),
      params,
    });
    return data;
  },
};
