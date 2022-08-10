import authReducer from "../slices/authReducer";
import baucuaReducer from "../slices/baucuaReducer";
import requestReducer from "../slices/requestReducer";

const { configureStore } = require("@reduxjs/toolkit");

const rootReducer = {
  user: authReducer,
  baucua: baucuaReducer,
  requests: requestReducer,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
