import axios from "axios";
import { url } from "../../../features/api";
import { useSelector } from "react-redux";

const PayButton = ({ cartItems }) => {
  const auth = useSelector((state) => state.auth);

  const handleCheckout = async () => {
    if (!auth?._id) {
      alert("Please login first!");
      return;
    }

    try {
      const res = await axios.post(`${url}/stripe/create-checkout-session`, {
        items: cartItems,
        userId: auth._id,
      });

      console.log("AUTH:", auth);

      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.log("Checkout error:", err.response?.data || err.message);
    }
  };

  return <button onClick={handleCheckout}>Check Out</button>;
};

export default PayButton;
