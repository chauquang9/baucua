import axios from "axios";
import { useDispatch } from "react-redux";
import StorageKeys from "../constants/storage-keys";
import { logout } from "../slices/authReducer";
import configs from "./configs";

function getCredentials() {
  const credentials = localStorage.getItem(StorageKeys.credentials);

  return credentials;
}

const axiosClient = axios.create({
  baseURL: configs.url,
});

// const { dispatch } = store;

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem(StorageKeys.credentials);
      localStorage.removeItem(StorageKeys.user);
      window.location.reload();

      return Promise.resolve();
    }

    return Promise.reject(error);
  }
);

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
      headers.Accept = `application/json`;
    }

    config.headers = headers;

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default axiosClient;
