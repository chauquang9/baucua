import axios from "../configs/axiosClient";

const userApi = {
  async getUser() {
    const url = "/api/user";
    return axios.get(url);
  },
};

export default userApi;
