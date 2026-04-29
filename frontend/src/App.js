import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import NavBar from "./components/NavBar";
import Cart from "./components/Cart";
import Home from "./components/Home";
import NotFound from "./components/NotFound";

import Login from "./components/authentication/login";
import Register from "./components/authentication/register";
import CheckoutSuccess from "./components/authentication/CheckOutSuccess";

/* ADMIN IMPORTS */

import Dashboard from "./components/admin/dashboard";
import ProductAdmin from "./components/admin/productAdmin";
import Summary from "./components/admin/summary";
import CreateProduct from "./components/admin/createProduct";

import ProductList from "./components/admin/list/productList";

import Orders from "./components/admin/orderAdmin";
import Users from "./components/admin/userAdmin";
import ProductDetail from "./components/admin/detail/productDetail";
import UserDetail from "./components/admin/detail/userDetail";
import OrderDetail from "./components/admin/detail/orderDetail";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer />

        <NavBar />

        <Routes>
          {/* ================= USER ROUTES ================= */}

          <Route path="/" element={<Home />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/register" element={<Register />} />

          <Route path="/login" element={<Login />} />

          <Route path="/checkout-success" element={<CheckoutSuccess />} />

          {/* ================= ADMIN ROUTES ================= */}

          <Route path="/admin" element={<Dashboard />}>
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="user/:id" element={<UserDetail />} />
            <Route path="order/:id" element={<OrderDetail />} />
            <Route path="summary" element={<Summary />} />

            <Route path="products" element={<ProductAdmin />}>
              <Route index element={<ProductList />} />

              <Route path="create-product" element={<CreateProduct />} />
            </Route>

            <Route path="orders" element={<Orders />} />

            <Route path="users" element={<Users />} />
          </Route>

          {/* ================= NOT FOUND ================= */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
