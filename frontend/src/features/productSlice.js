import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url, setHeaders } from "./api";
import { toast } from "react-toastify";

/* ============================
   INITIAL STATE
============================ */

const initialState = {
  items: [],
  status: null,
  createStatus: null,
  error: null,
};

/* ============================
   FETCH PRODUCTS
============================ */

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",

  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/products`);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

/* ============================
   CREATE PRODUCT
============================ */

export const createProducts = createAsyncThunk(
  "products/createProducts",

  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${url}/products`,
        values,
        setHeaders(),
      );

      return response.data;
    } catch (error) {
      toast.error(error.response?.data);

      return rejectWithValue(error.response?.data);
    }
  },
);

/* ============================
   DELETE PRODUCT
============================ */

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",

  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${url}/products/${id}`, setHeaders());

      return id;
    } catch (error) {
      toast.error("Delete failed");

      return rejectWithValue(error.response?.data);
    }
  },
);

/* ============================
   SLICE
============================ */

const productsSlice = createSlice({
  name: "products",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* ================= FETCH ================= */

      .addCase(fetchProducts.pending, (state) => {
        state.status = "pending";
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;

        state.status = "success";
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "rejected";

        state.error = action.payload;
      })

      /* ================= CREATE ================= */

      .addCase(createProducts.pending, (state) => {
        state.createStatus = "pending";
      })

      .addCase(createProducts.fulfilled, (state, action) => {
        state.items.push(action.payload);

        state.createStatus = "success";

        toast.success("Product Created!");
      })

      .addCase(createProducts.rejected, (state, action) => {
        state.createStatus = "rejected";

        state.error = action.payload;
      })

      /* ================= DELETE ================= */

      .addCase(deleteProduct.pending, (state) => {
        state.status = "pending";
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);

        state.status = "success";

        toast.success("Product Deleted!");
      })

      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "rejected";

        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
