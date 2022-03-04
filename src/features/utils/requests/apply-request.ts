import { UserApply } from "../../types";
import { post } from "../axiosConfig";
export const ApplyAPI = {
  async createApply(formData: Partial<UserApply>): Promise<UserApply> {
    const { data } = await post(`/api/apply/`, formData);
    return data;
  },
};
