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

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (
    payload,
    { dispatch, getState, rejectWithValue, fulfillWithValue }
  ) => {
    try {
      let dataRequest = {
        email: payload.get("email"),
        name: payload.get("name"),
      };
      const responseUser = await userApi.updateUser(dataRequest);
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

export const uploadAvatarUserProfile = createAsyncThunk(
  "auth/uploadAvatarUserProfile",
  async (
    payload,
    { dispatch, getState, rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const responseUser = await userApi.uploadAvatar(payload);
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

export const updateUserPassword = createAsyncThunk(
  "auth/updateUserPassword",
  async (
    payload,
    { dispatch, getState, rejectWithValue, fulfillWithValue }
  ) => {
    try {
      let dataRequest = {
        old_password: payload.get("old_password"),
        new_password: payload.get("new_password"),
        confirmation_new_password: payload.get("confirmation_new_password"),
      };
      const responseUser = await userApi.updatePassword(dataRequest);
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
    [updateUserProfile.pending]: (state, action) => {
      //some action here
    },
    [updateUserProfile.fulfilled]: (state, action) => {
      state.current = action.payload;
    },
    [updateUserProfile.rejected]: (state, action) => {
      state.error = action.payload;
    },
    [uploadAvatarUserProfile.fulfilled]: (state, action) => {
      state.current = action.payload;
      state.isLoading = 0;
    },
    [uploadAvatarUserProfile.rejected]: (state, action) => {
      state.error = action.payload;
      state.isLoading = 0;
    },
    [uploadAvatarUserProfile.pending]: (state, action) => {
      state.isLoading = 1;
    },
    [updateUserPassword.fulfilled]: (state, action) => {
      state.current = action.payload;
      state.isLoading = 0;
    },
    [updateUserPassword.rejected]: (state, action) => {
      state.error = action.payload;
    },
    [updateUserPassword.pending]: (state, action) => {},
  },
});

const { actions, reducer } = authSlice;
export const { logout, updateMoney } = actions;
export default reducer;
