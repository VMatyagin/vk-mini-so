import { SeasonReport, Season } from "../../types";
import { get, patch, post, remove } from "../axiosConfig";
import { ListResponse, SuccessResponse } from "../types";

export const ReportAPI = {
  async getReport(reportId: number): Promise<SeasonReport> {
    const { data } = await get(`/api/reports/${reportId}/`);
    return data;
  },
  async updateReport(
    id: number,
    formData: Partial<SeasonReport>
  ): Promise<SuccessResponse<SeasonReport>> {
    const { data } = await patch(`/api/reports/${id}/`, formData);
    return data;
  },
  async createReport(
    formData: Partial<SeasonReport>
  ): Promise<SuccessResponse<SeasonReport>> {
    const { data } = await post(`/api/reports/`, formData);
    return data;
  },
  async getSeasonsList({
    limit = 20,
    offset = 0,
    reportId,
  }: {
    limit?: number;
    offset?: number;
    reportId: number;
  }): Promise<ListResponse<Season>> {
    const params = {
      limit,
      offset,
    };
    const { data } = await get(`/api/reports/${reportId}/seasons/`, {
      params,
    });
    return data;
  },
  deleteSeason(
    reportId: number,
    seasonId: number
  ): Promise<SuccessResponse<Season>> {
    return remove(`/api/reports/${reportId}/seasons/${seasonId}/`);
  },
  async updateSeason(
    reportId: number,
    seasonId: number,
    formData: Partial<Season>
  ): Promise<SuccessResponse<Season>> {
    const { data } = await patch(
      `/api/reports/${reportId}/seasons/${seasonId}/`,
      formData
    );
    return data;
  },
  async createSeason(
    reportId: number,
    formData: Partial<Season>
  ): Promise<SuccessResponse<Season>> {
    const { data } = await post(`/api/reports/${reportId}/seasons/`, formData);
    return data;
  },
};
