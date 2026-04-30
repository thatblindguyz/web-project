import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { url, setHeaders } from "../../../features/api";

/* ============================
   HELPERS
============================ */
const deliveryColors = {
  pending: { bg: "#FEF9EC", color: "#92600A", border: "#FAC765" },
  processing: { bg: "#EEF2FF", color: "#3730A3", border: "#A5B4FC" },
  dispatched: { bg: "#EFF6FF", color: "#1D4ED8", border: "#93C5FD" },
  delivered: { bg: "#EAF3DE", color: "#3B6D11", border: "#C0DD97" },
  cancelled: { bg: "#FCEBEB", color: "#A32D2D", border: "#F7C1C1" },
};

const paymentColors = {
  pending: { bg: "#FEF9EC", color: "#92600A", border: "#FAC765" },
  paid: { bg: "#EAF3DE", color: "#3B6D11", border: "#C0DD97" },
  failed: { bg: "#FCEBEB", color: "#A32D2D", border: "#F7C1C1" },
  refunded: { bg: "#F5F0FF", color: "#5B21B6", border: "#C4B5FD" },
};

const getDeliveryStyle = (status = "") =>
  deliveryColors[status?.toLowerCase()] ?? {
    bg: "#F1F5F9",
    color: "#475569",
    border: "#CBD5E1",
  };

const getPaymentStyle = (status = "") =>
  paymentColors[status?.toLowerCase()] ?? {
    bg: "#F1F5F9",
    color: "#475569",
    border: "#CBD5E1",
  };

/* ============================
   COMPONENT
============================ */
const OrderDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  /* ================= FETCH ORDER ================= */
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `${url}/orders/find/${params.id}`,
          setHeaders(),
        );
        setOrder(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [params.id]);

  if (!order) return <Loading>Loading...</Loading>;

  const deliveryStyle = getDeliveryStyle(order.delivery_status);
  const paymentStyle = getPaymentStyle(order.payment_status);

  return (
    <Wrapper>
      {/* ===== HEADER ===== */}
      <Header>
        <Left>
          <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
          <div>
            <PageTitle>Order Detail</PageTitle>
            <OrderId>#{order._id?.slice(-8).toUpperCase()}</OrderId>
          </div>
        </Left>
        <BadgeRow>
          <StatusBadge
            $bg={deliveryStyle.bg}
            $color={deliveryStyle.color}
            $border={deliveryStyle.border}
          >
            {order.delivery_status || "—"}
          </StatusBadge>
          <StatusBadge
            $bg={paymentStyle.bg}
            $color={paymentStyle.color}
            $border={paymentStyle.border}
          >
            {order.payment_status || "—"}
          </StatusBadge>
        </BadgeRow>
      </Header>

      {/* ===== TOP ROW: ORDER INFO + SHIPPING INFO SIDE BY SIDE ===== */}
      <TopRow>
        {/* ORDER INFO */}
        <Card>
          <CardTitle>Order Info</CardTitle>
          <FieldList>
            <Field>
              <Label>Order ID</Label>
              <Value mono>#{order._id?.slice(-8).toUpperCase()}</Value>
            </Field>
            <Field>
              <Label>Total Amount</Label>
              <Value strong>${(order.total / 100).toLocaleString()}</Value>
            </Field>
            <Field>
              <Label>Payment</Label>
              <Value>
                <StatusBadge
                  $bg={paymentStyle.bg}
                  $color={paymentStyle.color}
                  $border={paymentStyle.border}
                >
                  {order.payment_status || "—"}
                </StatusBadge>
              </Value>
            </Field>
            <Field>
              <Label>Delivery</Label>
              <Value>
                <StatusBadge
                  $bg={deliveryStyle.bg}
                  $color={deliveryStyle.color}
                  $border={deliveryStyle.border}
                >
                  {order.delivery_status || "—"}
                </StatusBadge>
              </Value>
            </Field>
          </FieldList>
        </Card>

        {/* SHIPPING INFO */}
        <Card>
          <CardTitle>Shipping Info</CardTitle>
          <FieldList>
            <Field>
              <Label>Name</Label>
              <Value>{order.shipping?.name || "—"}</Value>
            </Field>
            <Field>
              <Label>Email</Label>
              <Value>{order.shipping?.email || "—"}</Value>
            </Field>
            <Field>
              <Label>Phone</Label>
              <Value>{order.shipping?.phone || "—"}</Value>
            </Field>
            <Field>
              <Label>Address</Label>
              <Value>
                {order.shipping?.address?.line1 || "—"}
                {order.shipping?.address?.line2 &&
                  `, ${order.shipping?.address?.line2}`}
              </Value>
            </Field>
            <Field>
              <Label>City</Label>
              <Value>{order.shipping?.address?.city || "—"}</Value>
            </Field>
            <Field>
              <Label>Country</Label>
              <Value>{order.shipping?.address?.country || "—"}</Value>
            </Field>
          </FieldList>
        </Card>
      </TopRow>

      {/* ===== PRODUCTS ===== */}
      <Card>
        <CardTitle>Products</CardTitle>
        <ProductList>
          {order.products?.map((item, index) => (
            <ProductRow key={index}>
              <ProductImage>
                <img src={item.image} alt={item.name} />
              </ProductImage>
              <ProductInfo>
                <ProductName>{item.name}</ProductName>
                <ProductMeta>{item.category}</ProductMeta>
              </ProductInfo>
              <ProductId mono>#{item.id?.slice(-8)?.toUpperCase()}</ProductId>
              <ProductQty>×{item.cartQuantity}</ProductQty>
              <ProductPrice>
                {item.price ? `$${item.price.toLocaleString()}` : "N/A"}
              </ProductPrice>
            </ProductRow>
          ))}
        </ProductList>
      </Card>
    </Wrapper>
  );
};

export default OrderDetail;

/* ================= STYLES ================= */
const Loading = styled.p`
  padding: 2rem;
  font-size: 16px;
  color: #64748b;
`;

const Wrapper = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1100px;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  background: #1e293b;
  color: #f8fafc;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #0f172a;
  }
`;

const PageTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px;
`;

const OrderId = styled.span`
  font-family: monospace;
  font-size: 14px;
  color: #475569;
  font-weight: 500;
  letter-spacing: 0.05em;
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  text-transform: capitalize;
  background-color: ${(p) => p.$bg};
  color: ${(p) => p.$color};
  border: 0.5px solid ${(p) => p.$border};
`;

/* ===== TOP ROW 2 COLUMNS ===== */
const TopRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

/* ===== CARD ===== */
const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
`;

/* ===== FIELD LIST ===== */
const FieldList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Field = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const Label = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  flex-shrink: 0;
`;

const Value = styled.span`
  font-size: 15px;
  font-weight: ${(p) => (p.strong ? 700 : 500)};
  color: #0f172a;
  font-family: ${(p) => (p.mono ? "monospace" : "inherit")};
  text-align: right;
`;

/* ===== PRODUCTS ===== */
const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProductRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 12px;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  background: #f8fafc;

  &:hover {
    border-color: #e2e8f0;
    background: #f1f5f9;
  }
`;

const ProductImage = styled.div`
  flex-shrink: 0;
  img {
    width: 56px;
    height: 56px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
  }
`;

const ProductInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProductName = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductMeta = styled.p`
  font-size: 13px;
  color: #475569;
  font-weight: 500;
  margin: 0;
  text-transform: capitalize;
`;

const ProductId = styled.span`
  font-family: monospace;
  font-size: 12px;
  color: #475569;
  font-weight: 500;
  flex-shrink: 0;
`;

const ProductQty = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  flex-shrink: 0;
  min-width: 32px;
  text-align: center;
`;

const ProductPrice = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  flex-shrink: 0;
  min-width: 60px;
  text-align: right;
`;
