import axios from "axios";
import { url } from "../../../features/api";
import { useSelector } from "react-redux";

const PayButton = ({ cartItems }) => {
  const auth = useSelector((state) => state.auth);

  const handleCheckout = async () => {
    const res = await axios.post(`${url}/create-checkout-session`, {
      items: cartItems,
      userId: auth._id,
    });

    if (res.data.url) {
      window.location.href = res.data.url;
    }
  };

  return <button onClick={handleCheckout}>Check Out</button>;
};

export default PayButton;
