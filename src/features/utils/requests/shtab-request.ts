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
    search,
    self,
  }: {
    offset?: number;
    limit?: number;
    search?: string;
    self?: boolean;
  } = {}): Promise<ListResponse<Shtab>> {
    if (cancel) {
      cancel();
    }
    const params = {
      offset,
      limit,
      search,
      self,
    };

    const { data } = await get("/api/shtab/", {
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      }),
      params,
    });
    return data;
  },
  async getShtab(shtabId: number): Promise<Shtab> {
    const { data } = await get(`/api/shtab/${shtabId}/`);
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
    const { data } = await get(`/api/shtab/${shtabId}/positions/`, {
      params,
    });
    return data;
  },
  async updateShtab({ id, ...rest }: Shtab): Promise<Shtab> {
    const { data } = await patch(`/api/shtab/${id}/`, rest);
    return data;
  },
  async setShtabPosition({
    formData,
    shtabId,
  }: {
    formData: Partial<Position>;
    shtabId: number;
  }): Promise<Position<false>> {
    const { data } = await post(`/api/shtab/${shtabId}/positions/`, formData);
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
      `/api/shtab/${shtabId}/positions/${positionId}/`
    );
    return data;
  },
  async updateShtabPosition(position: Partial<Position>): Promise<Position> {
    const { data } = await patch(
      `/api/shtab/${position.shtabId}/positions/${position.id}/`,
      position
    );
    return data;
  },
};
