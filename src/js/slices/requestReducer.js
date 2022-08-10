import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../services/authApi";
import StorageKeys from "../constants/storage-keys";
import userApi from "../services/userApi";
import axios from "../configs/axiosClient";
import requestApi from "../services/requestApi";

export const getRequests = createAsyncThunk(
  "requests/get-requests",
  async (
    payload,
    { dispatch, getState, rejectWithValue, fulfillWithValue }
  ) => {
    try {
      let dataRequest = {
        currentPage: payload,
      };
      let response = await requestApi.getRequests(dataRequest);

      return response.data;
    } catch (error) {
      if (error.response.status !== 200) {
        throw rejectWithValue(error.response.data.message);
      }
    }
  }
);

export const addRequests = createAsyncThunk(
  "requests/add-requests",
  async (
    payload,
    { dispatch, getState, rejectWithValue, fulfillWithValue }
  ) => {
    try {
      let dataRequest = {
        money: payload,
      };
      let response = await requestApi.addRequest(dataRequest);

      return response.data;
    } catch (error) {
      if (error.response.status !== 200) {
        throw rejectWithValue(error.response.data.message);
      }
    }
  }
);

export const changeStatus = createAsyncThunk(
  "requests/change-status",
  async (
    payload,
    { dispatch, getState, rejectWithValue, fulfillWithValue }
  ) => {
    try {
      let response = await requestApi.changeRequest(payload);

      return response.data;
    } catch (error) {
      if (error.response.status !== 200) {
        throw rejectWithValue(error.response.data.message);
      }
    }
  }
);

const requestSlice = createSlice({
  name: "requests",
  initialState: {
    data: {
      is_load_more: false,
      requests: [],
      total_request: 0,
    },
  },
  reducers: {
    cleanData(state) {
      state.data = {
        is_load_more: false,
        requests: [],
        total_request: 0,
      };
    },
  },
  extraReducers: {
    [getRequests.pending]: (state, action) => {
      state.isLoading = 1;
      //some action here
    },
    [getRequests.fulfilled]: (state, action) => {
      let newData = [...state.data.requests, ...action.payload.requests];
      state.data.requests = newData;
      state.data.is_load_more = action.payload.is_load_more;
      state.data.total_request = action.payload.total_request;
      state.isLoading = 0;
    },
    [getRequests.rejected]: (state, action) => {
      state.error = action.payload;
      state.isLoading = 0;
    },
    [addRequests.pending]: (state, action) => {
      //some action here
    },
    [addRequests.fulfilled]: (state, action) => {
      state.message = action.payload;
    },
    [addRequests.rejected]: (state, action) => {
      state.error = action.payload;
    },
    [changeStatus.pending]: (state, action) => {
      //some action here
    },
    [changeStatus.fulfilled]: (state, action) => {
      state.message = action.payload;
    },
    [changeStatus.rejected]: (state, action) => {
      state.error = action.payload;
    },
  },
});

const { actions, reducer } = requestSlice;
export const { cleanData } = actions;
export default reducer;
