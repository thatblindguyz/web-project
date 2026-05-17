import axios from "axios";
import { url } from "../../../features/api";
import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

const PayButton = ({ cartItems }) => {
  const auth = useSelector((state) => state.auth);
  const { cartTotalAmount } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  /* ================= STRIPE ================= */
  const handleStripeCheckout = async () => {
    if (!auth?._id) {
      alert("Vui lòng đăng nhập trước!");
      return;
    }
    try {
      const res = await axios.post(`${url}/stripe/create-checkout-session`, {
        items: cartItems.map((item) => ({
          _id: item._id,
          name: item.name,
          image: item.image,
          shortDesc: item.shortDesc,
          price: item.price,
          quantity: item.quantity,
          cartQuantity: item.cartQuantity,
          isDiscount: item.isDiscount,
          discountPercent: item.discountPercent,
        })),
        userId: auth._id,
        totalAmount: cartTotalAmount,
      });
      if (res.data.url) window.location.href = res.data.url;
    } catch (err) {
      console.log("Lỗi thanh toán thẻ:", err.response?.data || err.message);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  return (
    <ButtonGroup>
      <StripeBtn onClick={handleStripeCheckout}>
        <CardIcon />
        Thanh toán bằng thẻ
      </StripeBtn>
      <QRBtn onClick={() => navigate("/checkout")}>
        <TransferIcon />
        Thanh toán chuyển khoản
      </QRBtn>
    </ButtonGroup>
  );
};

export default PayButton;

/* ── ICON HELPERS ── */
const CardIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const TransferIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const spin = keyframes`to { transform: rotate(360deg); }`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const BaseBtn = styled.button`
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition:
    opacity 0.15s,
    transform 0.1s;
  &:hover {
    opacity: 0.88;
  }
  &:active {
    transform: scale(0.98);
  }
`;

const StripeBtn = styled(BaseBtn)`
  background: #1e293b;
  color: #f8fafc;
`;

const QRBtn = styled(BaseBtn)`
  background: #fff;
  color: #1e293b;
  border: 1.5px solid #e2e8f0;
  &:hover {
    border-color: #1e293b;
    opacity: 1;
  }
`;
