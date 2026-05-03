import styled, { keyframes } from "styled-components";
import { useEffect, useState } from "react";
import { url, setHeaders } from "../../../../features/api";
import axios from "axios";
import moment from "moment";

const Transactions = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await axios.get(`${url}/orders?new=true`, setHeaders());
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <StyledTransactions>
      <TableTitle>
        <span className="dot" />
        Latest Transactions
      </TableTitle>

      {isLoading ? (
        <LoadingRow>
          <Spinner />
          <span>Fetching transactions...</span>
        </LoadingRow>
      ) : (
        <>
          <TransactionHeader>
            <p>#</p>
            <p>Date</p>
            <p>Total</p>
            <p>Delivery</p>
            <p>Payment</p>
          </TransactionHeader>

          {orders?.map((order, index) => (
            <Transaction key={index}>
              <IndexCell>#{String(index + 1).padStart(2, "0")}</IndexCell>
              <p>{moment(order.createdAt).format("DD/MM")}</p>
              <TotalCell>${(order.total / 100).toLocaleString()}</TotalCell>
              <StatusBadge status={order.delivery_status}>
                {order.delivery_status}
              </StatusBadge>
              <PaymentBadge status={order.payment_status}>
                {order.payment_status}
              </PaymentBadge>
            </Transaction>
          ))}

          {orders.length === 0 && (
            <EmptyState>No transactions found.</EmptyState>
          )}
        </>
      )}
    </StyledTransactions>
  );
};

export default Transactions;

/* ================= STYLES ================= */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const COLS = "0.4fr 1fr 1fr 1.2fr 1.2fr";

const StyledTransactions = styled.div`
  background: linear-gradient(145deg, #1e2140, #252848);
  color: rgba(234, 234, 255, 0.87);
  padding: 1.5rem 1.75rem 1.75rem;
  border-radius: 12px;
  margin-top: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  animation: ${fadeIn} 0.4s ease;
`;

const TableTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(234, 234, 255, 0.95);
  margin: 0 0 1.25rem;
  display: flex;
  align-items: center;
  gap: 8px;

  .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #7c6af7;
    box-shadow: 0 0 6px #7c6af7;
  }
`;

const TransactionHeader = styled.div`
  display: grid;
  grid-template-columns: ${COLS};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(180, 180, 220, 0.55);
  padding: 0 0.5rem 0.6rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
`;

const Transaction = styled.div`
  display: grid;
  grid-template-columns: ${COLS};
  align-items: center;
  font-size: 13.5px;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.15s ease;
  border-radius: 6px;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.04);
  }

  p {
    margin: 0;
    color: rgba(200, 200, 230, 0.75);
  }
`;

const IndexCell = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: rgba(160, 160, 200, 0.4);
  font-variant-numeric: tabular-nums;
`;

const TotalCell = styled.p`
  font-weight: 700;
  color: rgba(234, 234, 255, 0.9) !important;
  font-variant-numeric: tabular-nums;
`;

const baseBadge = `
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  width: fit-content;
  letter-spacing: 0.02em;
`;

const StatusBadge = styled.span`
  ${baseBadge}
  background-color: ${({ status }) =>
    status === "pending"
      ? "rgba(253,181,40,0.12)"
      : status === "delivered"
        ? "rgba(114,225,40,0.12)"
        : "rgba(255,77,73,0.12)"};
  color: ${({ status }) =>
    status === "pending"
      ? "rgb(253,181,40)"
      : status === "delivered"
        ? "rgb(114,225,40)"
        : "rgb(255,77,73)"};
  border: 1px solid
    ${({ status }) =>
      status === "pending"
        ? "rgba(253,181,40,0.25)"
        : status === "delivered"
          ? "rgba(114,225,40,0.25)"
          : "rgba(255,77,73,0.25)"};
`;

const PaymentBadge = styled.span`
  ${baseBadge}
  background-color: ${({ status }) =>
    status === "paid"
      ? "rgba(114,225,40,0.12)"
      : status === "pending"
        ? "rgba(253,181,40,0.12)"
        : "rgba(255,77,73,0.12)"};
  color: ${({ status }) =>
    status === "paid"
      ? "rgb(114,225,40)"
      : status === "pending"
        ? "rgb(253,181,40)"
        : "rgb(255,77,73)"};
  border: 1px solid
    ${({ status }) =>
      status === "paid"
        ? "rgba(114,225,40,0.25)"
        : status === "pending"
          ? "rgba(253,181,40,0.25)"
          : "rgba(255,77,73,0.25)"};
`;

const LoadingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1.5rem 0.5rem;
  color: rgba(200, 200, 230, 0.5);
  font-size: 13px;
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(124, 106, 247, 0.25);
  border-top-color: #7c6af7;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const EmptyState = styled.p`
  text-align: center;
  padding: 2rem 0;
  color: rgba(200, 200, 230, 0.35);
  font-size: 13px;
`;
