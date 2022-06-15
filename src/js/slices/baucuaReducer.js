import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authApi from '../services/authApi';
import StorageKeys from '../constants/storage-keys';
import userApi from '../services/userApi';
import axios from '../configs/axiosClient';

export const baucua = createAsyncThunk(
    'baucua/lists',
    async (payload) => {
        try {
            const url = '/api/baucua';
            const response = await axios.get(url);

            return response.data;
        } catch (error) {
            return error.message;
        }
    }
)

const baucuaSlice = createSlice({
    name: 'auth',
    initialState: {
        baucua: []
    },
    reducers: {
        updateBauCua(state) {

        }
    },
    extraReducers: {
        [baucua.fulfilled]: (state, action) => {
            state.baucua = action.payload;
        }
    }
})

const { actions, reducer } = baucuaSlice;
export const {updateBauCua} = actions;
export default reducer