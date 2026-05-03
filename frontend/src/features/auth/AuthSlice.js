import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { url, setHeaders } from "../api";

const initialState = {
  token: localStorage.getItem("token"),
  name: "",
  email: "",
  _id: "",
  isAdmin: false,

  registerStatus: "",
  registerError: "",

  loginStatus: "",
  loginError: "",

  getUserStatus: "",
  getUserError: "",

  userLoaded: false,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (user, { rejectWithValue }) => {
    try {
      const token = await axios.post(`${url}/register`, {
        name: user.name,
        email: user.email,
        password: user.password,
      });

      localStorage.setItem("token", token.data);

      return token.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const loginUser = createAsyncThunk(
  "authentication/login",
  async (values, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${url}/login`, {
        email: values.email,
        password: values.password,
      });

      localStorage.setItem("token", res.data);

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/user/${id}`, setHeaders());

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    loadUser(state) {
      const token = state.token;

      if (token) {
        const user = jwtDecode(token);

        return {
          ...state,
          token,
          name: user.name,
          email: user.email,
          _id: user._id,

          isAdmin: user.isAdmin,

          userLoaded: true,
        };
      }

      return {
        ...state,
        isAdmin: true,
        userLoaded: true,
      };
    },

    logoutUser() {
      localStorage.removeItem("token");

      return {
        token: "",
        name: "",
        email: "",
        _id: "",
        isAdmin: false,
        registerStatus: "",
        registerError: "",
        loginStatus: "",
        loginError: "",
        getUserStatus: "",
        getUserError: "",
        userLoaded: false,
      };
    },
  },

  extraReducers: (builder) => {
    builder

      /* REGISTER */

      .addCase(registerUser.pending, (state) => {
        state.registerStatus = "pending";
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        const user = jwtDecode(action.payload);

        state.token = action.payload;
        state.name = user.name;
        state.email = user.email;
        state._id = user._id;
        state.isAdmin = user.isAdmin;
        state.registerStatus = "success";
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = "rejected";
        state.registerError = action.payload;
      })

      /* LOGIN */

      .addCase(loginUser.pending, (state) => {
        state.loginStatus = "pending";
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        const user = jwtDecode(action.payload);

        state.token = action.payload;
        state.name = user.name;
        state.email = user.email;
        state._id = user._id;
        state.isAdmin = user.isAdmin;
        state.loginStatus = "success";
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = "rejected";
        state.loginError = action.payload;
      })

      /* GET USER */

      .addCase(getUser.pending, (state) => {
        state.getUserStatus = "pending";
      })

      .addCase(getUser.fulfilled, (state) => {
        state.getUserStatus = "success";
      })

      .addCase(getUser.rejected, (state, action) => {
        state.getUserStatus = "rejected";
        state.getUserError = action.payload;
      });
  },
});

export const { loadUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
