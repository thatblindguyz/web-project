import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

/* ============================
   IMPORT SLICES
============================ */

import authReducer, { loadUser } from "./features/authSlice";
import productReducer from "./features/productSlice";
import cartReducer, { getTotals } from "./features/cartSlice";
import { productAPI } from "./features/productAPI";

import userReducer from "./features/userSlice";
import orderReducer from "./features/orderSlice";

/* ============================
   CONFIGURE STORE
============================ */

const store = configureStore({
  reducer: {
    auth: authReducer,

    products: productReducer,

    cart: cartReducer,

    users: userReducer,

    orders: orderReducer,

    // RTK Query
    [productAPI.reducerPath]: productAPI.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productAPI.middleware),
});

/* ============================
   INITIAL DISPATCH
============================ */

store.dispatch(loadUser());

store.dispatch(getTotals());

/* ============================
   RENDER APP
============================ */

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);

/* ============================
   DEBUG
============================ */

console.log("Redux state:", store.getState());
