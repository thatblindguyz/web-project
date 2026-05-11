import { configureStore, combineReducers } from "@reduxjs/toolkit";

import { persistStore, persistReducer } from "redux-persist";

import storage from "redux-persist/lib/storage";

import authReducer from "./auth/AuthSlice";
import cartReducer from "./cart/CartSlice";
import productReducer from "./product/ProductSlice";
import userReducer from "./user/UserSlice";
import orderReducer from "./order/OrderSlice";

import { productAPI } from "./product/ProductAPI";

/* ================= ROOT REDUCER ================= */

const rootReducer = combineReducers({
  products: productReducer,

  cart: cartReducer,

  auth: authReducer,

  users: userReducer,

  orders: orderReducer,

  // RTK QUERY
  [productAPI.reducerPath]: productAPI.reducer,
});

/* ================= PERSIST CONFIG ================= */

const persistConfig = {
  key: "root",

  storage,

  whitelist: ["auth", "cart"],
};

/* ================= PERSIST REDUCER ================= */

const persistedReducer = persistReducer(persistConfig, rootReducer);

/* ================= STORE ================= */

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(productAPI.middleware),
});

/* ================= PERSISTOR ================= */

export const persistor = persistStore(store);
