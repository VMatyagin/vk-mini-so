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
};
