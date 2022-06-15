import axios from "../configs/axiosClient";

const userApi = {
  getUser() {
    const url = "/api/user";
    return axios.get(url);
  },
};

export default userApi;
