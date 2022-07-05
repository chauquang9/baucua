import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../services/authApi";
import StorageKeys from "../constants/storage-keys";
import userApi from "../services/userApi";
import axios from "../configs/axiosClient";
import baucuaApi from "../services/baucuaApi";

export const baucua = createAsyncThunk("baucua/lists", async (payload) => {
  try {
    const url = "/api/baucua";
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    return error.message;
  }
});

export const gameStatus = createAsyncThunk("baucua/status", async (payload) => {
  try {
    const response = await baucuaApi.statusGame();

    return response.data;
  } catch (error) {
    return error.message;
  }
});

export const getBet = createAsyncThunk("baucua/getBet", async (payload) => {
  try {
    const response = await baucuaApi.getbet();

    return response.data;
  } catch (error) {
    return error.message;
  }
});

export const getTopPlayer = createAsyncThunk(
  "baucua/topPlayer",
  async (payload) => {
    try {
      const response = await baucuaApi.topPlayer();

      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);

const baucuaSlice = createSlice({
  name: "auth",
  initialState: {
    baucua: [],
    status: [],
  },
  reducers: {
    updateBauCua(state) {},
  },
  extraReducers: {
    [baucua.fulfilled]: (state, action) => {
      state.baucua = action.payload;
    },
    [gameStatus.fulfilled]: (state, action) => {
      state.status = action.payload;
    },
    [getBet.fulfilled]: (state, action) => {
      state.bet = action.payload;
    },
    [getTopPlayer.fulfilled]: (state, action) => {
      state.topPlayer = action.payload;
    },
  },
});

const { actions, reducer } = baucuaSlice;
export const { updateBauCua } = actions;
export default reducer;
