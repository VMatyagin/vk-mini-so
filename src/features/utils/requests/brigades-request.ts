import axios, { Canceler } from "axios";
import { Brigade, Position, SeasonReport, Season } from "../../types";
import { get, patch, post, remove } from "../axiosConfig";
import { ListResponse } from "../types";

const CancelToken = axios.CancelToken;
let cancel: Canceler | undefined;

export const BrigadesAPI = {
  async getBrigade(brigadeId: number): Promise<Brigade> {
    const { data } = await get(`/api/so/brigade/${brigadeId}/`);
    return data;
  },
  async getBrigadesList({
    limit = 20,
    offset = 0,
    shtabId,
    areaId,
    search,
    sort,
  }: {
    limit?: number;
    offset?: number;
    shtabId?: number;
    areaId?: number;
    search?: string;
    sort?: string;
  }): Promise<ListResponse<Brigade>> {
    const params = {
      limit,
      offset,
      shtabId,
      sort,
      search,
      areaId,
    };
    const { data } = await get(`/api/so/brigade/`, {
      params,
    });
    return data;
  },
  async getBrigadeReports({
    brigadeId,
    limit,
    offset,
  }: {
    brigadeId: number;
    offset: number;
    limit: number;
  }): Promise<ListResponse<SeasonReport>> {
    if (cancel) {
      cancel();
    }
    const params = {
      offset,
      limit,
    };
    const { data } = await get(`/api/so/brigade/${brigadeId}/reports/`, {
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      }),
      params,
    });
    return data;
  },
  async getBrigadeSeasonRequests({
    brigadeId,
    limit,
    offset,
  }: {
    brigadeId: number;
    offset: number;
    limit: number;
  }): Promise<ListResponse<SeasonReport>> {
    if (cancel) {
      cancel();
    }
    const params = {
      offset,
      limit,
    };
    const { data } = await get(
      `/api/so/brigade/${brigadeId}/season-requests/`,
      {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        }),
        params,
      }
    );
    return data;
  },
  async rejectSeasonRequest({
    brigadeId,
    reportId,
  }: {
    brigadeId: number;
    reportId: number;
  }): Promise<ListResponse<SeasonReport>> {
    const { data } = await post(
      `/api/so/brigade/${brigadeId}/season-requests/${reportId}/reject/`
    );
    return data;
  },
  async approveSeasonRequest({
    brigadeId,
    reportId,
  }: {
    brigadeId: number;
    reportId: number;
  }): Promise<ListResponse<SeasonReport>> {
    const { data } = await post(
      `/api/so/brigade/${brigadeId}/season-requests/${reportId}/approve/`
    );
    return data;
  },
  async mergeSeasonRequest({
    brigadeId,
    reportId,
    targetId,
  }: {
    brigadeId: number;
    reportId: number;
    targetId: number;
  }): Promise<ListResponse<SeasonReport>> {
    const { data } = await post(
      `/api/so/brigade/${brigadeId}/season-requests/${reportId}/merge/`,
      { targetId }
    );
    return data;
  },
  async getBrigadeSeason({
    limit,
    offset,
    search,
    brigadeId,
  }: {
    offset: number;
    limit: number;
    search?: string;
    brigadeId?: number;
  }): Promise<ListResponse<Season>> {
    if (cancel) {
      cancel();
    }
    const params = {
      offset,
      limit,
      search,
    };

    const { data } = await get(`/api/so/brigade/${brigadeId}/seasons/`, {
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      }),
      params,
    });
    return data;
  },
  async updateBrigade({
    id,
    dateOfBirth,
    title,
  }: {
    id: number;
    title: string;
    dateOfBirth: string | null;
  }): Promise<Brigade> {
    const { data } = await patch(`/api/so/brigade/${id}/`, {
      dateOfBirth,
      title,
    });
    return data;
  },
  async getBrigadePositions({
    brigadeId,
    hideLast,
  }: {
    brigadeId: number;
    hideLast?: boolean;
  }): Promise<Position[]> {
    const params = { hideLast };
    const { data } = await get(`/api/so/brigade/${brigadeId}/positions/`, {
      params,
    });
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
  }): Promise<Position> {
    const { data } = await remove(
      `/api/so/brigade/${brigadeId}/positions/${positionId}/`
    );
    return data;
  },
  async updateBrigadePosition(position: Position): Promise<Position> {
    const { id, brigade, shtab, ...rest } = position;
    const { data } = await patch(
      `/api/so/brigade/${brigade.id}/positions/${id}/`,
      rest
    );
    return data;
  },
  async applyBrigade(id: number): Promise<void> {
    const { data } = await post(`/api/so/brigade/${id}/apply/`);
    return data;
  },
};
