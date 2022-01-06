import axios, { Canceler } from "axios";
import {
  Achievement,
  Activity,
  Boec,
  ParticipantHistory,
  Position,
  Progress,
  Season,
  SeasonReport,
  Viewer,
} from "../../types";
import { get, patch, post, remove } from "../axiosConfig";
import { ListResponse, SuccessResponse } from "../types";

const CancelToken = axios.CancelToken;
let cancel: Canceler | undefined;

export const UsersAPI = {
  async getMeData(): Promise<Viewer> {
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
  async getUserSeasons(
    userId: number,
    state?: Season["state"]
  ): Promise<Season[]> {
    const params = { state };
    const { data } = await get(`/api/so/boec/${userId}/seasons/`, {
      params,
    });
    return data;
  },
  async createNewSeason({
    boecId,
    report,
  }: {
    boecId: number;
    report: Partial<SeasonReport>;
  }): Promise<SuccessResponse<Season>> {
    return post(`/api/so/boec/${boecId}/seasons/`, report);
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
  async getBoecAchievements(boecId?: number): Promise<Achievement[]> {
    const { data } = await get(`/api/me/achievements/`, {
      params: {
        boecId,
      },
    });
    return data;
  },
  async getMeProgress(): Promise<Progress> {
    const { data } = await get(`/api/me/progress/`);
    return data;
  },
  async getActivities({
    seen,
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
    seen?: boolean;
  }): Promise<ListResponse<Activity>> {
    if (cancel) {
      cancel();
    }
    const params = {
      offset,
      limit,
      seen,
    };
    const { data } = await get(`/api/activity/`, {
      params,
    });
    return data;
  },
  async ActivietisMarkAsRead(): Promise<void> {
    const { data } = await post(`/api/activity/markAsRead`);
    return data;
  },
  async getBoecHistory(boecId?: number): Promise<ParticipantHistory> {
    const { data } = await get(`/api/so/boec/${boecId}/history/`);
    return data;
  },
};
