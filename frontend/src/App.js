import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

/* USER UI */

import NavBar from "./components/homeUI/layout/NavBar";
import Home from "./components/homeUI/pages/Home";
import Cart from "./components/homeUI/pages/Cart";
import NotFound from "./components/homeUI/pages/NotFound";
import ProductPage from "./components/homeUI/pages/ProductPage";

/* AUTH */

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import CheckoutSuccess from "./components/auth/CheckOutSuccess";

/* USER ORDER  */

import UserOrderDetail from "./components/homeUI/userOrder/UserOrderDetail";
import MyOrders from "./components/homeUI/userOrder/MyOrders";

/* ADMIN */

import Dashboard from "./components/admin/dashboard/Dashboard";
import ProductAdmin from "./components/admin/page/ProductAdmin";
import OrderAdmin from "./components/admin/page/OrderAdmin";
import UserAdmin from "./components/admin/page/UserAdmin";

import Summary from "./components/admin/dashboard/Summary";
import ProductList from "./components/admin/list/ProductList";
import CreateProduct from "./components/admin/create/CreateProduct";

import ProductDetail from "./components/admin/detail/ProductDetail";
import UserDetail from "./components/admin/detail/UserDetail";
import OrderDetail from "./components/admin/detail/OrderDetail";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer />

        <NavBar />

        <Routes>
          {/* USER */}

          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductPage />} />

          {/* LIST ORDERS */}
          <Route path="/my-orders" element={<MyOrders />} />

          {/* ORDER DETAIL */}
          <Route path="/order/:id" element={<UserOrderDetail />} />

          {/* AUTH */}

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />

          {/* ADMIN */}

          <Route path="/admin" element={<Dashboard />}>
            <Route path="summary" element={<Summary />} />

            <Route path="products" element={<ProductAdmin />}>
              <Route index element={<ProductList />} />
              <Route path="create-product" element={<CreateProduct />} />
            </Route>

            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="user/:id" element={<UserDetail />} />
            <Route path="order/:id" element={<OrderDetail />} />

            <Route path="orders" element={<OrderAdmin />} />
            <Route path="users" element={<UserAdmin />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
