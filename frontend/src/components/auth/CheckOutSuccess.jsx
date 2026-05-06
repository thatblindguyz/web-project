import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../../features/cart/CartSlice";
import { useNavigate } from "react-router-dom";

const CheckoutSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearCart());

    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [dispatch, navigate]);

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
      }}
    >
      <h2>Checkout Successful!</h2>

      <p>Your order has been placed successfully.</p>

      <p>Redirecting to home...</p>
    </div>
  );
};

export default CheckoutSuccess;
