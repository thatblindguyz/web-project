import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { url, setHeaders } from "../api";

/* ================= INITIAL STATE ================= */

const initialState = {
  items: [],
  status: null,
  error: null,
};

/* ================= FETCH ORDERS ================= */

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",

  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/orders`, setHeaders());

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

/* ================= SLICE ================= */

const orderSlice = createSlice({
  name: "orders",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchOrders.pending, (state) => {
        state.status = "pending";
      })

      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.items = action.payload;

        state.status = "success";
      })

      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "rejected";

        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
