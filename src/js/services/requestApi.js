import axios from "../configs/axiosClient";

const requestApi = {
  async getRequests(params) {
    const url = "/api/get-requests";
    return axios.get(url, { params: params });
  },
  async addRequest(data) {
    const url = "/api/add-request";
    return axios.post(url, data);
  },
  async changeRequest(data) {
    const url = "/api/change-status";
    return axios.post(url, data);
  },
};

export default requestApi;
