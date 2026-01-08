import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "../local/auth";
import { MainApi } from "../api/ApiGateway";

import notificationReducer from "../redux/notificationSlice";
import { FastRecommendationApi } from "../api/fastApi";

// Combine all reducers
const rootReducer = combineReducers({
  [MainApi.reducerPath]: MainApi.reducer,
  [FastRecommendationApi.reducerPath]: FastRecommendationApi.reducer, // ✅ add reducer
  localAuth: authReducer,
  notifications: notificationReducer,
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["notifications"], // only persist notifications
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }).concat(MainApi.middleware, FastRecommendationApi.middleware), // ✅ add middleware
  devTools: true,
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
