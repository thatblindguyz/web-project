import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url, setHeaders } from "../api";
import { toast } from "react-toastify";

/* ============================
   INITIAL STATE
============================ */

const initialState = {
  items: [],
  status: null,
  createStatus: null,
  error: null,
  createError: null,
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
      const message = error.response?.data?.message || "Lỗi tạo sản phẩm";
      toast.error(message);
      return rejectWithValue(message);
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
   UPDATE PRODUCT
============================ */

export const updateProduct = createAsyncThunk(
  "products/updateProduct",

  async (product, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${url}/products/${product.id}`,
        product,
        setHeaders(),
      );

      return res.data;
    } catch (err) {
      toast.error("Update failed");

      return rejectWithValue(err.response?.data);
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

      /* CREATE  */
      .addCase(createProducts.fulfilled, (state, action) => {
        state.items.push(action.payload);

        state.createStatus = "success";
        state.createError = null;
        toast.success("Thêm sản phẩm thành công!");
      })

      .addCase(createProducts.pending, (state) => {
        state.createStatus = "pending";
        state.createError = null;
      })

      .addCase(createProducts.rejected, (state, action) => {
        state.createStatus = "rejected";
        state.createError = action.payload;
      })

      /* UPDATE */

      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id,
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }

        toast.success("Cập nhật sản phẩm thành công!");
      })

      /* DELETE */

      .addCase(deleteProduct.pending, (state) => {
        state.status = "pending";
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);

        state.status = "success";

        toast.success("Xóa sản phẩm thành công!");
      })

      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "rejected";

        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
