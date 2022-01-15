import { UserApply } from "../../types";
import { get, post } from "../axiosConfig";
export const ApplyAPI = {
  async getOwn(): Promise<UserApply> {
    const { data } = await get("/api/apply/");
    return data;
  },

  async createApply(formData: Partial<UserApply>): Promise<UserApply> {
    const { data } = await post(`/api/apply/`, formData);
    return data;
  },
};
