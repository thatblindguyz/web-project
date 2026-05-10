import { useState } from "react";
import axios from "axios";
import { url } from "../../../features/api";
import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

const PayButton = ({ cartItems }) => {
  const auth = useSelector((state) => state.auth);
  const { cartTotalAmount } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });

  /* ================= STRIPE ================= */
  const handleStripeCheckout = async () => {
    if (!auth?._id) {
      alert("Vui lòng đăng nhập trước!");
      return;
    }
    try {
      const res = await axios.post(`${url}/stripe/create-checkout-session`, {
        items: cartItems,
        userId: auth._id,
        totalAmount: cartTotalAmount,
        customerInfo,
      });
      if (res.data.url) window.location.href = res.data.url;
    } catch (err) {
      console.log("Lỗi thanh toán thẻ:", err.response?.data || err.message);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  /* ================= XÁC NHẬN CHUYỂN KHOẢN ================= */
  const handleConfirmPayment = async () => {
    setConfirming(true);
    try {
      await axios.post(`${url}/manual-order/create`, {
        items: cartItems,
        userId: auth._id,
        totalAmount: cartTotalAmount,
        customerInfo,
      });
      setShowQR(false);
      navigate("/checkout-success");
    } catch (err) {
      console.log("Lỗi tạo order:", err.response?.data || err.message);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setConfirming(false);
    }
  };

  const qrUrl = `https://img.vietqr.io/image/970422-0123456789-compact2.png?amount=${Math.round(cartTotalAmount)}&addInfo=Thanh toan don hang TECHCOM&accountName=TECHCOM STORE`;

  return (
    <>
      <ButtonGroup>
        <StripeBtn onClick={handleStripeCheckout}>
          <CardIcon />
          Thanh toán bằng thẻ
        </StripeBtn>
        <QRBtn onClick={() => setShowQR(true)}>
          <TransferIcon />
          Thanh toán chuyển khoản
        </QRBtn>
      </ButtonGroup>

      {/* ── QR MODAL ── */}
      {showQR && (
        <Overlay onClick={() => setShowQR(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            {/* HEADER */}
            <ModalHeader>
              <HeaderLeft>
                <ModalTitle>Thanh toán chuyển khoản</ModalTitle>
              </HeaderLeft>
              <CloseBtn onClick={() => setShowQR(false)}>✕</CloseBtn>
            </ModalHeader>

            <Divider />

            <ModalSub>
              Quét mã QR hoặc chuyển khoản theo thông tin bên dưới
            </ModalSub>

            <Divider />
            {/* BODY – 2 cột */}
            <ModalBody>
              {/* CỘT TRÁI – QR */}
              <RightCol>
                <ColLabel>Mã QR thanh toán</ColLabel>
                <QRWrapper>
                  <QRImage src={qrUrl} alt="QR thanh toán" />
                </QRWrapper>
                <QRNote>
                  Mở app ngân hàng → chọn <strong>Quét QR</strong> → xác nhận
                  chuyển khoản
                </QRNote>
              </RightCol>

              {/* DIVIDER DỌC */}
              <ColDivider />

              {/* CỘT PHẢI – Form */}
              <LeftCol>
                <ColLabel>Thông tin nhận hàng</ColLabel>

                <FieldGroup>
                  <FieldLabel>Họ và tên</FieldLabel>
                  <Input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Số điện thoại</FieldLabel>
                  <Input
                    type="text"
                    placeholder="0912 345 678"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        phone: e.target.value,
                      })
                    }
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    placeholder="example@gmail.com"
                    value={customerInfo.email}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        email: e.target.value,
                      })
                    }
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Địa chỉ giao hàng</FieldLabel>
                  <Input
                    type="text"
                    placeholder="Số nhà, đường, quận, tỉnh/thành"
                    value={customerInfo.address}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        address: e.target.value,
                      })
                    }
                  />
                </FieldGroup>

                {/* Bank info dưới form */}
                <InfoBox>
                  <InfoRow>
                    <InfoLabel>Ngân hàng</InfoLabel>
                    <InfoValue>MB Bank</InfoValue>
                  </InfoRow>
                  <InfoRowDivider />
                  <InfoRow>
                    <InfoLabel>Số tài khoản</InfoLabel>
                    <InfoValue $mono>0123456789</InfoValue>
                  </InfoRow>
                  <InfoRowDivider />
                  <InfoRow>
                    <InfoLabel>Chủ tài khoản</InfoLabel>
                    <InfoValue>TECHCOM STORE</InfoValue>
                  </InfoRow>
                  <InfoRowDivider />
                  <InfoRow>
                    <InfoLabel>Số tiền</InfoLabel>
                    <AmountValue>
                      {Math.round(cartTotalAmount).toLocaleString("vi-VN")}₫
                    </AmountValue>
                  </InfoRow>
                  <InfoRowDivider />
                  <InfoRow>
                    <InfoLabel>Nội dung CK</InfoLabel>
                    <InfoValue>Thanh toan TECHCOM</InfoValue>
                  </InfoRow>
                </InfoBox>
              </LeftCol>
            </ModalBody>

            <Divider />

            {/* FOOTER */}
            <ModalFooter>
              <Note>
                Sau khi chuyển khoản thành công, nhấn xác nhận để hoàn tất đơn
                hàng.
              </Note>
              <ConfirmBtn onClick={handleConfirmPayment} disabled={confirming}>
                {confirming ? <Spinner /> : "✓ Tôi đã thanh toán"}
              </ConfirmBtn>
            </ModalFooter>
          </Modal>
        </Overlay>
      )}
    </>
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

/* ── ANIMATIONS ── */
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const slideUp = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`;
const spin = keyframes`to{transform:rotate(360deg)}`;

/* ── BUTTONS ── */
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

/* ── OVERLAY / MODAL ── */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: ${fadeIn} 0.2s ease;
`;
const Modal = styled.div`
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 980px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
  animation: ${slideUp} 0.25s ease;
  overflow: hidden;
`;

/* ── HEADER ── */
const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.25rem 1.5rem 1rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ModalTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

const ModalSub = styled.p`
  font-size: 14px;
  color: #64748b;
  text-align: center;
  width: 100%;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
`;

const CloseBtn = styled.button`
  width: 28px !important;
  height: 28px !important;
  min-width: 28px;
  font-size: 18px;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  flex: unset !important;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 0;
`;

/* ── 2-COL BODY ── */
const ModalBody = styled.div`
  display: flex;
  gap: 0;
  padding: 1.25rem 1.5rem;
  @media (max-width: 560px) {
    flex-direction: column;
  }
`;

const LeftCol = styled.div`
  flex: 1.4;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  align-items: flex-start;
`;

const RightCol = styled.div`
  flex: 0 0 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding-left: 1.5rem;
  @media (max-width: 560px) {
    padding-left: 0;
    padding-top: 1.25rem;
  }
`;

const ColDivider = styled.div`
  width: 1px;
  background: #f1f5f9;
  margin: 0 0 0 1.5rem;
  flex-shrink: 0;
  @media (max-width: 560px) {
    width: auto;
    height: 1px;
    margin: 1.25rem 0 0;
  }
`;

const ColLabel = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 2px;
  text-align: left;
  width: 100%;
`;

/* ── FORM ── */
const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  text-align: left;
`;
const Input = styled.input`
  width: 100%;
  height: 44px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 0 12px;
  font-size: 13px;
  outline: none;
  color: #0f172a;
  background: #f8fafc;
  transition: border-color 0.15s;
  &:focus {
    border-color: #1d4ed8;
    background: #fff;
  }
  &::placeholder {
    color: #cbd5e1;
  }
`;

/* ── BANK INFO BOX ── */
const InfoBox = styled.div`
  width: 100%;
  box-sizing: border-box;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 4px;
`;
const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
`;
const InfoRowDivider = styled.hr`
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 0;
`;
const InfoLabel = styled.span`
  font-size: 12px;
  color: #64748b;
  flex-shrink: 0;
`;
const InfoValue = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
  text-align: right;
  font-family: ${(p) => (p.$mono ? "monospace" : "inherit")};
`;
const AmountValue = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #1d4ed8;
`;

/* ── QR ── */
const QRWrapper = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
const QRImage = styled.img`
  width: 220px;
  height: 220px;
  object-fit: contain;
  border-radius: 8px;
`;
const QRNote = styled.p`
  font-size: 12px;
  font-weight: 700;
  color: #334155;
  text-align: center;
  line-height: 1.6;
  margin: 0;
  strong {
    color: #64748b;
  }
`;

/* ── FOOTER ── */
const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #f8fafc;
`;
const Note = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  margin: 0;
  line-height: 1.5;
  flex: 1;
`;
const ConfirmBtn = styled.button`
  flex-shrink: 0;
  height: 40px;
  padding: 0 20px;
  background: ${(p) => (p.disabled ? "#e2e8f0" : "#16a34a")};
  color: ${(p) => (p.disabled ? "#94a3b8" : "#fff")};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  transition: background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  &:hover:not(:disabled) {
    background: #15803d;
  }
`;
const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;
