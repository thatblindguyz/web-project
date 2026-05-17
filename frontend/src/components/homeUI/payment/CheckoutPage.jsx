import { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../../features/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const CheckoutPage = () => {
  const auth = useSelector((state) => state.auth);
  const { cartItems, cartTotalAmount } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });

  /* ESC → về cart */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") navigate("/cart");
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [navigate]);

  /* Scroll lên đầu */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await axios.post(`${url}/manual-order/create`, {
        items: cartItems.map((item) => ({
          _id: item._id,
          name: item.name,
          image: item.image?.startsWith("http") ? item.image : "",
          shortDesc: item.shortDesc,
          price: item.price,
          quantity: item.quantity,
          cartQuantity: item.cartQuantity,
          isDiscount: item.isDiscount,
          discountPercent: item.discountPercent,
        })),
        userId: auth._id,
        totalAmount: cartTotalAmount,
        customerInfo,
      });
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
    <Wrapper>
      {/* ── HEADER ── */}
      <PageHeader>
        <HeaderInner>
          <BackBtn onClick={() => navigate("/cart")}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Quay lại giỏ hàng
          </BackBtn>
          <PageTitle>Thanh toán chuyển khoản</PageTitle>
          <EscHint>Nhấn ESC để huỷ</EscHint>
        </HeaderInner>
      </PageHeader>

      {/* ── BODY ── */}
      <Body>
        <BodyInner>
          <SubText>
            Quét mã QR hoặc chuyển khoản theo thông tin bên dưới, sau đó nhấn
            xác nhận.
          </SubText>

          <ContentRow>
            {/* ── CỘT TRÁI: QR ── */}
            <LeftCol>
              <ColCard>
                <ColLabel>Mã QR thanh toán</ColLabel>
                <QRWrapper>
                  <QRImage src={qrUrl} alt="QR thanh toán" />
                </QRWrapper>
                <QRNote>
                  Mở app ngân hàng → chọn <strong>Quét QR</strong> → xác nhận
                  chuyển khoản
                </QRNote>

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
              </ColCard>
            </LeftCol>

            {/* ── CỘT PHẢI: FORM ── */}
            <RightCol>
              <ColCard>
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

                {/* Order summary */}
                <SummaryBox>
                  <ColLabel style={{ marginBottom: "10px" }}>
                    Đơn hàng của bạn
                  </ColLabel>
                  {cartItems.map((item) => (
                    <SummaryRow key={item._id}>
                      <SummaryImg src={item.image} alt={item.name} />
                      <SummaryInfo>
                        <SummaryName>{item.name}</SummaryName>
                        <SummaryQty>x{item.cartQuantity}</SummaryQty>
                      </SummaryInfo>
                      <SummaryPrice>
                        {(item.price * item.cartQuantity).toLocaleString(
                          "vi-VN",
                        )}
                        ₫
                      </SummaryPrice>
                    </SummaryRow>
                  ))}
                  <TotalRow>
                    <TotalLabel>Tổng cộng</TotalLabel>
                    <TotalAmount>
                      {Math.round(cartTotalAmount).toLocaleString("vi-VN")}₫
                    </TotalAmount>
                  </TotalRow>
                </SummaryBox>

                {/* Buttons */}
                <BtnGroup>
                  <CancelBtn onClick={() => navigate("/cart")}>
                    ← Huỷ, quay lại giỏ hàng
                  </CancelBtn>
                  <ConfirmBtn onClick={handleConfirm} disabled={confirming}>
                    {confirming ? <Spinner /> : "✓ Tôi đã thanh toán"}
                  </ConfirmBtn>
                </BtnGroup>
              </ColCard>
            </RightCol>
          </ContentRow>
        </BodyInner>
      </Body>
    </Wrapper>
  );
};

export default CheckoutPage;

/* ═══════════════════════════════════════
   STYLED COMPONENTS
═══════════════════════════════════════ */
const spin = keyframes`to { transform: rotate(360deg); }`;

const Wrapper = styled.div`
  background: #f1f5f9;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderInner = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  white-space: nowrap;
  transition: color 0.15s;
  &:hover {
    color: #1e293b;
  }
`;

const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const EscHint = styled.span`
  margin-left: auto;
  font-size: 12px;
  color: #94a3b8;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 3px 10px;
`;

const Body = styled.div`
  padding: 2rem 0;
`;

const BodyInner = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const SubText = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0 0 1.5rem;
`;

const ContentRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 1.5rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeftCol = styled.div``;
const RightCol = styled.div``;

const ColCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  box-sizing: border-box;
`;

const ColLabel = styled.p`
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0;
`;

const QRWrapper = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const QRImage = styled.img`
  width: 100%;
  max-width: 260px;
  object-fit: contain;
  border-radius: 8px;
`;

const QRNote = styled.p`
  font-size: 13px;
  color: #334155;
  text-align: center;
  line-height: 1.6;
  margin: 0;
  strong {
    color: #1e293b;
  }
`;

const InfoBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.75rem 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
`;

const InfoRowDivider = styled.hr`
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 0;
`;

const InfoLabel = styled.span`
  font-size: 13px;
  color: #64748b;
`;

const InfoValue = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  font-family: ${(p) => (p.$mono ? "monospace" : "inherit")};
`;

const AmountValue = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FieldLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #475569;
`;

const Input = styled.input`
  height: 42px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
  color: #0f172a;
  background: #f8fafc;
  transition: border-color 0.15s;
  &:focus {
    border-color: #1e293b;
    background: #fff;
  }
  &::placeholder {
    color: #cbd5e1;
  }
`;

const SummaryBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SummaryImg = styled.img`
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  flex-shrink: 0;
`;

const SummaryInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SummaryName = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SummaryQty = styled.p`
  font-size: 12px;
  color: #64748b;
  margin: 0;
`;

const SummaryPrice = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
  flex-shrink: 0;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #e2e8f0;
  margin-top: 4px;
`;

const TotalLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
`;

const TotalAmount = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
`;

const BtnGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
`;

const CancelBtn = styled.button`
  width: 100%;
  height: 42px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    border-color: #1e293b;
    color: #1e293b;
  }
`;

const ConfirmBtn = styled.button`
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  border: none;
  background: ${(p) => (p.disabled ? "#e2e8f0" : "#1e293b")};
  color: ${(p) => (p.disabled ? "#94a3b8" : "white")};
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s;
  &:hover:not(:disabled) {
    background: #0f172a;
  }
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;
