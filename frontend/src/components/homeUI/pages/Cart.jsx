import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
  addToCart,
  clearCart,
  decreaseCart,
  removeFromCart,
  getTotals,
} from "../../../features/cart/CartSlice";

import { useEffect } from "react";
import PayButton from "../payment/PayButton";

const Cart = () => {
  const { cartItems, cartTotalAmount } = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getTotals());
  }, [cartItems, dispatch]);

  const handleRemoveFromCart = (cartItem) => {
    dispatch(removeFromCart({ ...cartItem, userId: auth._id }));
  };

  const handleDecreaseCart = (cartItem) => {
    dispatch(decreaseCart({ ...cartItem, userId: auth._id }));
  };

  const handleIncreaseCart = (cartItem) => {
    dispatch(addToCart({ ...cartItem, userId: auth._id }));
  };

  const handleClearCart = () => {
    dispatch(clearCart({ userId: auth._id }));
  };

  const getPrice = (item) =>
    item.isDiscount && item.discountPercent > 0
      ? item.price * (1 - item.discountPercent / 100)
      : item.price;

  return (
    <div className="cart-container">
      <h2 className="title">Your Cart</h2>

      {cartItems.length === 0 && (
        <>
          <div className="empty-cart">
            <p>Your cart is currently empty.</p>
          </div>
          <div className="start-shopping">
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                />
              </svg>
              <span>Start Shopping</span>
            </Link>
          </div>
        </>
      )}

      {cartItems.length > 0 && (
        <div>
          <div className="titles">
            <h3 className="product-title">Product</h3>
            <h3 className="price">Price</h3>
            <h3 className="quantity">Quantity</h3>
            <h3 className="total">Total</h3>
          </div>

          <div className="cart-items">
            {cartItems?.map((cartItem) => (
              <div className="cart-item" key={cartItem._id}>
                <div className="cart-product">
                  <img src={cartItem.image} alt={cartItem.name} />
                  <div>
                    <h3>{cartItem.name}</h3>
                    <p>{cartItem.shortDesc || cartItem.desc}</p>
                    <button onClick={() => handleRemoveFromCart(cartItem)}>
                      Remove
                    </button>
                  </div>
                </div>

                {/* PRICE */}
                <div className="cart-product-price">
                  {getPrice(cartItem).toLocaleString("vi-VN")}₫
                  {cartItem.isDiscount && cartItem.discountPercent > 0 && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        textDecoration: "line-through",
                        marginLeft: "6px",
                        display: "block",
                      }}
                    >
                      {cartItem.price.toLocaleString("vi-VN")}₫
                    </span>
                  )}
                </div>

                {/* QUANTITY */}
                <div className="cart-product-quantity">
                  <button onClick={() => handleDecreaseCart(cartItem)}>
                    -
                  </button>
                  <div className="count">{cartItem.cartQuantity}</div>
                  <button onClick={() => handleIncreaseCart(cartItem)}>
                    +
                  </button>
                </div>

                {/* TOTAL */}
                <div className="cart-product-total-price">
                  {(getPrice(cartItem) * cartItem.cartQuantity).toLocaleString(
                    "vi-VN",
                  )}
                  ₫
                </div>
              </div>
            ))}
          </div>

          {/* CART SUMMARY */}
          <div className="cart-summary">
            <button className="clear-cart" onClick={handleClearCart}>
              Clear Cart
            </button>

            <div className="continue-shopping">
              <Link to="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                  />
                </svg>
                <span>Continue Shopping</span>
              </Link>
            </div>

            {/* CHECKOUT */}
            <div className="cart-checkout">
              <div className="subtotal">
                <span>Subtotal</span>
                <span className="amount">
                  {cartTotalAmount.toLocaleString("vi-VN")}₫
                </span>
              </div>

              <p>Taxes and shipping calculated at checkout</p>

              {auth._id ? (
                <PayButton cartItems={cartItems} />
              ) : (
                <button
                  className="cart-login"
                  onClick={() => navigate("/login")}
                >
                  Login to Checkout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
