import axios from "../configs/axiosClient";

const userApi = {
  async getUser() {
    const url = "/api/user";
    return axios.get(url);
  },
  async updateUser(data) {
    const url = "/api/user/update";
    return axios.post(url, data);
  },
  async uploadAvatar(data) {
    const url = "/api/user/update";
    return axios.post(url, data, {
      headers: {
        "Content-type": "multipart/form-data",
      },
    });
  },
  async updatePassword(data) {
    const url = "/api/user/change-password";
    return axios.post(url, data);
  },
};

export default userApi;
