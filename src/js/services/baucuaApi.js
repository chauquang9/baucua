import axios from "../configs/axiosClient";

const baucuaApi = {
  startButton() {
    const url = "/api/baucua/start";

    return axios.get(url);
  },
  stopButton() {
    const url = "/api/baucua/stop";

    return axios.get(url);
  },
  resultGame() {
    const url = "/api/baucua/result";

    return axios.get(url);
  },
  deletebet(params) {
    const url = "/api/baucua/deletebet";

    return axios.delete(url, { data: params });
  },
  async topPlayer() {
    const url = "/api/baucua/topplayer";

    return axios.get(url);
  },
  async statusGame() {
    const url = "/api/baucua/status";

    return axios.get(url);
  },
  async addbet(params) {
    const url = "/api/baucua/addbet";

    return axios.post(url, params);
  },
  async getbet(params) {
    const url = "/api/baucua/getbet";

    return axios.get(url, params);
  },
  async getFilters() {
    const url = "/api/filters";

    return axios.get(url);
  },
  getStatistics(params) {
    const url = "/api/statistics";

    return axios.get(url, { params: params });
  },
};

export default baucuaApi;
