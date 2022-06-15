import axios from "axios";
import StorageKeys from "../constants/storage-keys";

function getCredentials() {
  const credentials = localStorage.getItem(StorageKeys.credentials);

  return credentials;
}

const axiosClient = axios.create({
  baseURL: "http://dev.baucua-laravel.com/",
});

axiosClient.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    let credentials = getCredentials();

    let accessToken = JSON.parse(credentials);

    const headers = {
      "content-type": "application/json",
    };

    if (accessToken != null) {
      headers.Authorization = `Bearer ${accessToken.access_token}`;
    }

    config.headers = headers;

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default axiosClient;
