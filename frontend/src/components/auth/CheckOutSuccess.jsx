import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../../features/cart/CartSlice";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaCheckCircle } from "react-icons/fa";

const CheckoutSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    dispatch(clearCart());

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [dispatch, navigate]);

  return (
    <Wrapper>
      <Card>
        <IconWrap>
          <FaCheckCircle size={48} color="#16a34a" />
        </IconWrap>
        <Title>Đặt hàng thành công!</Title>
        <Sub>Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận.</Sub>
        <Redirect>Chuyển về trang chủ sau {countdown}s...</Redirect>
      </Card>
    </Wrapper>
  );
};

export default CheckoutSuccess;

/* ================= STYLES ================= */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 2rem;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 3rem 2rem;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  animation: ${fadeIn} 0.35s ease;
`;

const IconWrap = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

const Sub = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;
  text-align: center;
  line-height: 1.6;
`;

const Redirect = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8;
  margin: 0.5rem 0 0;
`;
