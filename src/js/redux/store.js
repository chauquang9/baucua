import authReducer from "../slices/authReducer";
import baucuaReducer from "../slices/baucuaReducer";

const { configureStore } = require("@reduxjs/toolkit");

const rootReducer = {
  user: authReducer,
  baucua: baucuaReducer,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
