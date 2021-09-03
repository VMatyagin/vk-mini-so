import { Voting } from "../../types";
import { post } from "../axiosConfig";

export const PollAPI = {
  async vote({
    answerId,
    pollId,
  }: {
    answerId: number;
    pollId: number;
  }): Promise<Voting> {
    const { data } = await post(`/api/voting/${pollId}/vote/`, {
      answerId,
    });
    return data;
  },
};
