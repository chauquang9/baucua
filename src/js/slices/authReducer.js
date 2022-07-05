import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../services/authApi";
import StorageKeys from "../constants/storage-keys";
import userApi from "../services/userApi";
import axios from "../configs/axiosClient";

export const login = createAsyncThunk(
  "auth/login",
  async (
    payload,
    { dispatch, getState, rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const username = payload.get("email");
      const password = payload.get("password");
      const response = await authApi.login(username, password);
      const now = new Date();
      const expire_time =
        Math.floor(now.getTime() / 1000) + response.data.expires_in;
      response.data.expires_time = expire_time;
      localStorage.setItem(
        StorageKeys.credentials,
        JSON.stringify(response.data)
      );

      const url = "/api/user";
      const responseUser = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${response.data.access_token}`,
        },
      });
      const user = { ...responseUser.data };
      const data = {
        ...user,
      };
      localStorage.setItem(StorageKeys.user, JSON.stringify(data));

      return data;
    } catch (error) {
      if (error.response.status !== 200) {
        throw rejectWithValue(error.response.data.message);
      }
    }
  }
);

export const userProfile = createAsyncThunk(
  "auth/userProfile",
  async (payload) => {
    try {
      const responseUser = await userApi.getUser();
      const user = { ...responseUser.data };
      const data = {
        ...user,
      };
      localStorage.setItem(StorageKeys.user, JSON.stringify(data));

      return data;
    } catch (error) {
      return error.message;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    current: JSON.parse(localStorage.getItem(StorageKeys.user)) || {},
    settings: {},
  },
  reducers: {
    logout(state) {
      //clear local storage
      state.current = {};
      localStorage.removeItem(StorageKeys.credentials);
      localStorage.removeItem(StorageKeys.user);
    },
    updateMoney(state, action) {
      const { money } = action.payload;
      state.current.price = money;
    },
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      //some action here
    },
    [login.fulfilled]: (state, action) => {
      state.current = action.payload;
    },
    [login.rejected]: (state, action) => {
      state.current = action.payload;
    },
    [userProfile.fulfilled]: (state, action) => {
      state.current = action.payload;
    },
  },
});

const { actions, reducer } = authSlice;
export const { logout, updateMoney } = actions;
export default reducer;
