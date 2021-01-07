import { Poll, Vote } from "../stores/vote-store/types";

const axios = require("axios");

const instance = axios.create({
  baseURL: "http://localhost:1337/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const strapi = {
  async init(vkData: any) {
    try {
      const { data } = await instance.post("/vk-users", vkData);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  async getPolls() {
    try {
      const { data } = await instance.get("/polls");
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  async getQuestions(id: number) {
    try {
      const { data } = await instance.get(`/poll-questions?poll=${id}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  async getVotes(id: number, user: number) {
    try {
      const { data } = await instance.get(
        `/poll-votes?poll=${id}&user=${user}`
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  async sendVote(voteData: Vote) {
    try {
      const { data } = await instance.post(`/poll-votes`, voteData);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  async updatePoll(id: number, voteData: Partial<Poll>) {
    try {
      const { data } = await instance.put(`/polls/${id}`, voteData);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  async pastSo(so: { title: string; direction: number; shtab: number }) {
    try {
      const { data } = await instance.post(`/sos`, so);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  async getResultsByQuestion(id: number) {
    try {
      const { data } = await instance.get(`/poll-questions/result/${id}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
};
