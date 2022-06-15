import axios from "../configs/axiosClient";
import client from "../configs/clientIdAndSecret";

const authApi = {
  login(email, password) {
    const url = "/oauth/token";
    const data = {
      grant_type: "password",
      client_id: client.client_id,
      client_secret: client.client_secret,
      username: email,
      password: password,
      scope: "*",
    };

    return axios.post(url, data);
  },
  getUser() {
    const url = "/api/user";
    return axios.get(url);
  },
};

export default authApi;
