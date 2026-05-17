import { useEffect, useState } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { url, setHeaders } from "../../../features/api";

/* ══════════════════════════════
   HELPERS
══════════════════════════════ */

const DELIVERY_MAP = {
  pending: {
    bg: "#FEF9C3",
    color: "#854D0E",
    border: "#FDE047",
    label: "Đang chờ xử lý",
  },
  processing: {
    bg: "#EEF2FF",
    color: "#3730A3",
    border: "#A5B4FC",
    label: "Đang xử lý",
  },
  dispatched: {
    bg: "#EFF6FF",
    color: "#1D4ED8",
    border: "#93C5FD",
    label: "Đã gửi hàng", // badge trên card header
  },
  delivering: {
    bg: "#EFF6FF",
    color: "#1D4ED8",
    border: "#93C5FD",
    label: "Đã gửi hàng", // giữ cùng label
  },
  delivered: {
    bg: "#F0FDF4",
    color: "#166534",
    border: "#86EFAC",
    label: "Đã giao",
  },
  cancelled: {
    bg: "#FEF2F2",
    color: "#991B1B",
    border: "#FECACA",
    label: "Đã hủy",
  },
};

const getDelivery = (status = "") =>
  DELIVERY_MAP[status?.toLowerCase()] ?? {
    bg: "#F1F5F9",
    color: "#475569",
    border: "#CBD5E1",
    label: "Không xác định",
  };

const STEP_ORDER = ["processing", "dispatched", "delivered"];

/* ══════════════════════════════
   COMPONENT
══════════════════════════════ */

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${url}/orders/my-orders`, setHeaders());
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const cancelOrder = async (id) => {
    try {
      const res = await axios.put(
        `${url}/orders/cancel/${id}`,
        {},
        setHeaders(),
      );
      setOrders((prev) => prev.map((o) => (o._id === id ? res.data : o)));
    } catch (err) {
      console.log(err);
    } finally {
      setConfirmId(null);
    }
  };

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const getPrice = (item) =>
    item.isDiscount && item.discountPercent > 0
      ? item.price * (1 - item.discountPercent / 100)
      : item.price;

  return (
    <Wrapper>
      {/* ── Page header ── */}
      <PageHeader>
        <HeaderInner>
          <PageTitle>
            <TitleAccent />
            Đơn hàng của tôi
          </PageTitle>
          {orders.length > 0 && (
            <OrderCount>{orders.length} đơn hàng</OrderCount>
          )}
        </HeaderInner>
      </PageHeader>

      <ContentInner>
        {orders.length === 0 ? (
          <EmptyWrap>
            <EmptyIcon>
              <svg
                width="52"
                height="52"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <path d="M9 17H5a2 2 0 00-2 2v0a2 2 0 002 2h14a2 2 0 002-2v0a2 2 0 00-2-2h-4" />
                <path d="M9 17V7a2 2 0 012-2h2a2 2 0 012 2v10" />
                <rect x="9" y="17" width="6" height="0" />
              </svg>
            </EmptyIcon>
            <EmptyTitle>Chưa có đơn hàng nào</EmptyTitle>
            <EmptyDesc>Bạn chưa thực hiện đơn hàng nào.</EmptyDesc>
          </EmptyWrap>
        ) : (
          <OrderList>
            {orders.map((order) => {
              const ds = getDelivery(order.delivery_status);
              const cancelled = order.delivery_status === "cancelled";
              const isOpen = !!expanded[order._id];
              const rawStatus = order.delivery_status?.toLowerCase().trim();
              const normalizedStatus =
                rawStatus === "delivering" ? "dispatched" : rawStatus;
              const stepIdx = STEP_ORDER.indexOf(normalizedStatus);

              return (
                <OrderCard key={order._id}>
                  {/* ── Card header ── */}
                  <CardHeader onClick={() => toggleExpand(order._id)}>
                    <HeaderLeft>
                      <OrderId>#{order._id.slice(-8).toUpperCase()}</OrderId>
                      <DateText>
                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </DateText>
                    </HeaderLeft>

                    <HeaderRight>
                      <BadgeRow>
                        {!cancelled && (
                          <BadgeGroup>
                            <BadgeGroupLabel>
                              <svg
                                width="11"
                                height="11"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <rect
                                  x="1"
                                  y="4"
                                  width="22"
                                  height="16"
                                  rx="2"
                                />
                                <line x1="1" y1="10" x2="23" y2="10" />
                              </svg>
                              Thanh toán
                            </BadgeGroupLabel>
                            <PayBadge $paid={order.payment_status === "paid"}>
                              {order.payment_status === "paid"
                                ? "Đã thanh toán"
                                : "Chờ thanh toán"}
                            </PayBadge>
                          </BadgeGroup>
                        )}
                        <BadgeGroup>
                          <BadgeGroupLabel>
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <rect x="1" y="3" width="15" height="13" rx="2" />
                              <path d="M16 8h4l3 4v3h-7V8z" />
                              <circle cx="5.5" cy="18.5" r="2.5" />
                              <circle cx="18.5" cy="18.5" r="2.5" />
                            </svg>
                            Vận chuyển
                          </BadgeGroupLabel>
                          <DelivBadge
                            $bg={ds.bg}
                            $color={ds.color}
                            $border={ds.border}
                          >
                            {ds.label}
                          </DelivBadge>
                        </BadgeGroup>
                      </BadgeRow>
                      <TotalAmount>
                        {order.total?.toLocaleString("vi-VN")}₫
                      </TotalAmount>
                      <ChevronIcon $open={isOpen}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </ChevronIcon>
                    </HeaderRight>
                  </CardHeader>

                  {/* ── Progress tracker (non-cancelled) ── */}
                  {!cancelled && stepIdx >= 0 && (
                    <ProgressRow>
                      {STEP_ORDER.map((step, i) => {
                        const done = i <= stepIdx;
                        const active = i === stepIdx;
                        return (
                          <ProgressStep key={step}>
                            <StepDot $done={done} $active={active}>
                              {done && !active && (
                                <svg
                                  width="10"
                                  height="10"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="white"
                                  strokeWidth="3"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                              {active && <StepPulse />}
                            </StepDot>
                            <StepLabel $active={active} $done={done}>
                              {DELIVERY_MAP[step]?.label}
                            </StepLabel>
                            {i < STEP_ORDER.length - 1 && (
                              <StepLine $done={i < stepIdx} />
                            )}
                          </ProgressStep>
                        );
                      })}
                    </ProgressRow>
                  )}

                  {/* ── Expandable body ── */}
                  {isOpen && (
                    <CardBody>
                      <BodyDivider />

                      {/* Shipping info */}
                      <BodySection>
                        <BodySectionTitle>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="1" y="3" width="15" height="13" rx="2" />
                            <path d="M16 8h4l3 4v3h-7V8z" />
                            <circle cx="5.5" cy="18.5" r="2.5" />
                            <circle cx="18.5" cy="18.5" r="2.5" />
                          </svg>
                          Thông tin giao hàng
                        </BodySectionTitle>
                        <InfoGrid>
                          <InfoItem>
                            <InfoLabel>Người nhận</InfoLabel>
                            <InfoValue>{order.shipping?.name}</InfoValue>
                          </InfoItem>
                          <InfoItem>
                            <InfoLabel>Địa chỉ</InfoLabel>
                            <InfoValue>
                              {order.shipping?.address?.line1}
                              {order.shipping?.address?.line2 && (
                                <>, {order.shipping.address.line2}</>
                              )}
                            </InfoValue>
                          </InfoItem>
                          <InfoItem>
                            <InfoLabel>Thành phố</InfoLabel>
                            <InfoValue>
                              {order.shipping?.address?.city}
                            </InfoValue>
                          </InfoItem>
                        </InfoGrid>
                      </BodySection>

                      <BodyDivider />

                      {/* Products */}
                      <BodySection>
                        <BodySectionTitle>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 01-8 0" />
                          </svg>
                          Sản phẩm ({order.products?.length})
                        </BodySectionTitle>
                        <ProductList>
                          {order.products?.map((item, i) => (
                            <ProductRow key={i}>
                              <ProductImg src={item.image} alt={item.name} />
                              <ProductDetail>
                                <ProductName>{item.name}</ProductName>
                                <ProductSub>
                                  Số lượng: {item.cartQuantity}
                                </ProductSub>
                              </ProductDetail>
                              <ProductPrice>
                                {getPrice(item).toLocaleString("vi-VN")}₫
                                {item.isDiscount &&
                                  item.discountPercent > 0 && (
                                    <ProductOld>
                                      {item.price?.toLocaleString("vi-VN")}₫
                                    </ProductOld>
                                  )}
                              </ProductPrice>
                            </ProductRow>
                          ))}
                        </ProductList>
                      </BodySection>

                      <BodyDivider />

                      {/* Footer: total + cancel */}
                      <CardFooter>
                        {!cancelled &&
                          order.delivery_status !== "delivered" && (
                            <CancelBtn onClick={() => setConfirmId(order._id)}>
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                              </svg>
                              Hủy đơn hàng
                            </CancelBtn>
                          )}
                        <TotalRow>
                          <TotalLabel>Tổng cộng</TotalLabel>
                          <TotalFinal>
                            {order.total?.toLocaleString("vi-VN")}₫
                          </TotalFinal>
                        </TotalRow>
                      </CardFooter>
                    </CardBody>
                  )}
                </OrderCard>
              );
            })}
          </OrderList>
        )}
      </ContentInner>

      {/* ── Confirm modal ── */}
      {confirmId && (
        <ModalOverlay>
          <ModalBox>
            <ModalIcon>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#dc2626"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </ModalIcon>
            <ModalTitle>Hủy đơn hàng?</ModalTitle>
            <ModalText>
              Bạn có chắc muốn hủy đơn hàng này không? Hành động này không thể
              hoàn tác.
            </ModalText>
            <ModalActions>
              <ModalBack onClick={() => setConfirmId(null)}>Quay lại</ModalBack>
              <ModalConfirm onClick={() => cancelOrder(confirmId)}>
                Xác nhận hủy
              </ModalConfirm>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}
    </Wrapper>
  );
};

export default MyOrders;

/* ═══════════════════════════════════
   STYLED COMPONENTS
═══════════════════════════════════ */

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.8); opacity: 0; }
`;

/* Layout */
const Wrapper = styled.div`
  background: #f1f5f9;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  background: white;
  border-bottom: 1px solid #e2e8f0;
`;
const HeaderInner = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const PageTitle = styled.h1`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;
const TitleAccent = styled.div`
  width: 4px;
  height: 20px;
  background: #1d4ed8;
  border-radius: 2px;
  flex-shrink: 0;
`;
const OrderCount = styled.span`
  font-size: 13px;
  color: #64748b;
`;

const ContentInner = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  animation: ${fadeUp} 0.4s ease both;
`;

/* Empty */
const EmptyWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 0;
  gap: 12px;
`;
const EmptyIcon = styled.div`
  width: 90px;
  height: 90px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  margin-bottom: 8px;
`;
const EmptyTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;
const EmptyDesc = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;
`;

/* Order list */
const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OrderCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.15s;
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
  }
`;

/* Card header (clickable) */
const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  cursor: pointer;
  gap: 12px;
  flex-wrap: wrap;
`;
const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;
const OrderId = styled.span`
  font-family: monospace;
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 0.06em;
`;
const DateText = styled.span`
  font-size: 12px;
  color: #94a3b8;
`;
const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;
const BadgeRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-wrap: wrap;
`;
const BadgeGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: fit-content;
`;
const BadgeGroupLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  svg {
    flex-shrink: 0;
  }
`;
const PayBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  width: fit-content;
  white-space: nowrap;
  background: ${(p) => (p.$paid ? "#EFF6FF" : "#FEF9C3")};
  color: ${(p) => (p.$paid ? "#1D4ED8" : "#854D0E")};
  border: 1px solid ${(p) => (p.$paid ? "#93C5FD" : "#FDE047")};
`;
const DelivBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  width: fit-content;
  white-space: nowrap;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
  border: 1px solid ${(p) => p.$border};
`;
const TotalAmount = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #1d4ed8;
`;
const ChevronIcon = styled.div`
  color: #94a3b8;
  display: flex;
  transition: transform 0.2s;
  transform: ${(p) => (p.$open ? "rotate(180deg)" : "rotate(0)")};
`;

/* Progress tracker */
const ProgressRow = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0 18px 14px;
  gap: 0;
`;
const ProgressStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
`;
const StepDot = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${(p) => (p.$done ? "#1d4ed8" : "#e2e8f0")};
  border: 2px solid ${(p) => (p.$done ? "#1d4ed8" : "#cbd5e1")};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
`;
const StepPulse = styled.div`
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid #1d4ed8;
  animation: ${pulse} 1.6s ease-in-out infinite;
`;
const StepLabel = styled.span`
  font-size: 10px;
  font-weight: ${(p) => (p.$active ? 700 : 500)};
  color: ${(p) => (p.$active ? "#1d4ed8" : p.$done ? "#475569" : "#94a3b8")};
  margin-top: 5px;
  text-align: center;
  line-height: 1.3;
`;
const StepLine = styled.div`
  position: absolute;
  top: 11px;
  left: calc(50% + 11px);
  width: calc(100% - 22px);
  height: 2px;
  background: ${(p) => (p.$done ? "#1d4ed8" : "#e2e8f0")};
`;

/* Card body */
const CardBody = styled.div`
  padding: 0 18px 18px;
`;
const BodyDivider = styled.div`
  height: 1px;
  background: #f1f5f9;
  margin: 12px 0;
`;
const BodySection = styled.div``;
const BodySectionTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #475569;
  margin: 0 0 10px;
  svg {
    color: #1d4ed8;
    flex-shrink: 0;
  }
`;
const InfoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 2.5rem;
`;
const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;
const InfoLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
`;
const InfoValue = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
`;

/* Products */
const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const ProductRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 10px 12px;
`;
const ProductImg = styled.img`
  width: 52px;
  height: 52px;
  object-fit: cover;
  border-radius: 7px;
  border: 1px solid #e2e8f0;
  background: white;
  flex-shrink: 0;
`;
const ProductDetail = styled.div`
  flex: 1;
  min-width: 0;
`;
const ProductName = styled.span`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const ProductSub = styled.span`
  font-size: 12px;
  color: #64748b;
`;
const ProductPrice = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #1d4ed8;
  white-space: nowrap;
  text-align: right;
`;
const ProductOld = styled.div`
  font-size: 11px;
  color: #94a3b8;
  text-decoration: line-through;
`;

/* Card footer */
const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 4px;
  flex-wrap: wrap;
  gap: 10px;
`;
const CancelBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  height: 32px;
  padding: 0 14px;
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #fee2e2;
  }
`;
const TotalRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
`;
const TotalLabel = styled.span`
  font-size: 13px;
  color: #475569;
  font-weight: 600;
`;
const TotalFinal = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: #1d4ed8;
`;

/* Modal */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(2px);
`;
const ModalBox = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 28px 24px;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  animation: ${fadeUp} 0.25s ease both;
`;
const ModalIcon = styled.div`
  width: 52px;
  height: 52px;
  background: #fef2f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;
const ModalTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  text-align: center;
`;
const ModalText = styled.p`
  font-size: 13px;
  color: #64748b;
  text-align: center;
  margin: 0;
  line-height: 1.6;
`;
const ModalActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  width: 100%;
`;
const ModalBack = styled.button`
  flex: 1;
  height: 38px;
  background: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #f1f5f9;
  }
`;
const ModalConfirm = styled.button`
  flex: 1;
  height: 38px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.15s,
    transform 0.15s;
  &:hover {
    background: #b91c1c;
    transform: translateY(-1px);
  }
`;
