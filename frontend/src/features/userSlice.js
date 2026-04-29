import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { url, setHeaders } from "./api";
import { toast } from "react-toastify";

/* ================= INITIAL STATE ================= */

const initialState = {
  items: [],
  status: null,
  error: null,
};

/* ================= FETCH USERS ================= */

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",

  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/users`, setHeaders());

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

/* ================= DELETE USER ================= */

export const deleteUser = createAsyncThunk(
  "users/deleteUser",

  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${url}/users/${id}`, setHeaders());

      return id;
    } catch (err) {
      toast.error("Delete failed");

      return rejectWithValue(err.response?.data);
    }
  },
);

/* ================= SLICE ================= */

const userSlice = createSlice({
  name: "users",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchUsers.pending, (state) => {
        state.status = "pending";
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.items = action.payload;

        state.status = "success";
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "rejected";

        state.error = action.payload;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);

        toast.success("User Deleted!");
      });
  },
});

export default userSlice.reducer;
