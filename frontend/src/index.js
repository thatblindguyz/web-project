import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { Provider } from "react-redux";

import { store } from "./features/Store";

/* ================= RENDER APP ================= */

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);

/* ================= DEBUG ================= */

console.log("Redux state:", store.getState());
