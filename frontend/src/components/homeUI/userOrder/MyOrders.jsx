import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { url, setHeaders } from "../../../features/api";

/* ============================
   HELPERS
============================ */

const deliveryColors = {
  pending: { bg: "#FEF9C3", color: "#854D0E", border: "#FDE047" },
  processing: { bg: "#EEF2FF", color: "#3730A3", border: "#A5B4FC" },
  dispatched: { bg: "#EFF6FF", color: "#1D4ED8", border: "#93C5FD" },
  delivered: { bg: "#EAF3DE", color: "#3B6D11", border: "#C0DD97" },
  cancelled: { bg: "#FCEBEB", color: "#A32D2D", border: "#F7C1C1" },
};

const getDeliveryStyle = (status = "") =>
  deliveryColors[status?.toLowerCase()] ?? {
    bg: "#F1F5F9",
    color: "#475569",
    border: "#CBD5E1",
  };

/* ============================
   COMPONENT
============================ */

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  /* ============================
     FETCH ORDERS
  ============================ */

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

    // auto refresh mỗi 5s
    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);
  }, []);

  /* ============================
     CANCEL ORDER
  ============================ */

  const [confirmId, setConfirmId] = useState(null);

  const cancelOrder = async (id) => {
    try {
      const res = await axios.put(
        `${url}/orders/cancel/${id}`,
        {},
        setHeaders(),
      );
      setOrders((prev) => prev.map((o) => (o._id === id ? res.data : o)));
      setConfirmId(null);
    } catch (err) {
      console.log(err);
      setConfirmId(null);
    }
  };

  return (
    <Wrapper>
      <PageTitle>My Orders</PageTitle>

      {orders.length === 0 ? (
        <Empty>No orders found.</Empty>
      ) : (
        orders.map((order) => {
          const deliveryStyle = getDeliveryStyle(order.delivery_status);

          return (
            <OrderCard key={order._id}>
              {/* HEADER */}
              <OrderHeader>
                <OrderId>Order #{order._id.slice(-8)}</OrderId>

                <BadgeRow>
                  <PaymentBadge $paid={order.payment_status === "paid"}>
                    {order.payment_status}
                  </PaymentBadge>

                  <StatusBadge
                    $bg={deliveryStyle.bg}
                    $color={deliveryStyle.color}
                    $border={deliveryStyle.border}
                  >
                    {order.delivery_status}
                  </StatusBadge>
                </BadgeRow>
              </OrderHeader>

              {/* INFO */}
              <Section>
                <InfoGrid>
                  <InfoItem>
                    <Label>Total</Label>
                    <Value>${(order.total / 100).toLocaleString()}</Value>
                  </InfoItem>

                  <InfoItem>
                    <Label>Date</Label>
                    <Value>
                      {new Date(order.createdAt).toLocaleString("en-GB")}
                    </Value>
                  </InfoItem>
                </InfoGrid>
              </Section>

              {/* CANCEL BUTTON */}
              {order.delivery_status !== "delivered" &&
                order.delivery_status !== "cancelled" && (
                  <CancelBtn onClick={() => setConfirmId(order._id)}>
                    Cancel Order
                  </CancelBtn>
                )}

              <Divider />

              {/* SHIPPING */}
              <Section>
                <SectionTitle>Shipping Info</SectionTitle>

                <InfoGrid>
                  <InfoItem>
                    <Label>Name</Label>
                    <Value>{order.shipping?.name}</Value>
                  </InfoItem>

                  <InfoItem>
                    <Label>Address</Label>
                    <Value>
                      <div>{order.shipping?.address?.line1}</div>

                      {order.shipping?.address?.line2 && (
                        <div>{order.shipping?.address?.line2}</div>
                      )}
                    </Value>
                  </InfoItem>

                  <InfoItem>
                    <Label>City</Label>
                    <Value>{order.shipping?.address?.city}</Value>
                  </InfoItem>
                </InfoGrid>
              </Section>

              <Divider />

              {/* PRODUCTS */}
              <Section>
                <SectionTitle>Products</SectionTitle>

                <ProductList>
                  {order.products?.map((item, index) => (
                    <ProductItem key={index}>
                      <ProductImage src={item.image} alt={item.name} />

                      <ProductInfo>
                        <ProductName>{item.name}</ProductName>
                        <ProductMeta>Qty: {item.cartQuantity}</ProductMeta>
                        <ProductMeta>
                          ${item.price?.toLocaleString()}
                        </ProductMeta>
                      </ProductInfo>
                    </ProductItem>
                  ))}
                </ProductList>
              </Section>
            </OrderCard>
          );
        })
      )}
      {confirmId && (
        <ModalOverlay>
          <ModalBox>
            <ModalTitle>Cancel Order</ModalTitle>
            <ModalText>Are you sure you want to cancel this order?</ModalText>
            <ModalActions>
              <ModalCancel onClick={() => setConfirmId(null)}>
                Go back
              </ModalCancel>
              <ModalConfirm onClick={() => cancelOrder(confirmId)}>
                Yes, cancel
              </ModalConfirm>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}
    </Wrapper>
  );
};

export default MyOrders;

/* ================= STYLES ================= */

const Wrapper = styled.div`
  padding: 2rem 3rem;
  background: #f8fafc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 680px;
`;

const Empty = styled.p`
  font-size: 16px;
  color: #64748b;
`;

const OrderCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 680px;
`;

const OrderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const OrderId = styled.span`
  font-family: monospace;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: 0.04em;
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 6px;
`;

const PaymentBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  background-color: ${({ $paid }) => ($paid ? "#EFF6FF" : "#FEF9C3")};
  color: ${({ $paid }) => ($paid ? "#1D4ED8" : "#854D0E")};
  border: 0.5px solid ${({ $paid }) => ($paid ? "#93C5FD" : "#FDE047")};
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  background-color: ${(p) => p.$bg};
  color: ${(p) => p.$color};
  border: 0.5px solid ${(p) => p.$border};
`;

const Section = styled.div`
  padding: 0.5rem 0;
`;

const SectionTitle = styled.h4`
  font-size: 13px;
  font-weight: 800;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 2px 0;
`;

const InfoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 2rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Label = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: #1e293;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const Value = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: #475569;
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
`;

const ProductImage = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ProductName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
`;

const ProductMeta = styled.span`
  font-size: 13px;
  color: #64748b;
`;

const CancelBtn = styled.button`
  margin-top: 8px;
  padding: 4px 12px;
  height: 30px;
  background-color: #fcebeb;
  color: #a32d2d;
  border: 0.5px solid #f7c1c1;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover {
    opacity: 0.82;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ModalTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
`;

const ModalText = styled.p`
  font-size: 14px;
  color: #475569;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const ModalCancel = styled.button`
  padding: 0 14px;
  height: 32px;
  background: #f8fafc;
  color: #475569;
  border: 0.5px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover {
    opacity: 0.82;
  }
`;

const ModalConfirm = styled.button`
  padding: 0 14px;
  height: 32px;
  background-color: #fcebeb;
  color: #a32d2d;
  border: 0.5px solid #f7c1c1;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover {
    opacity: 0.82;
  }
`;
