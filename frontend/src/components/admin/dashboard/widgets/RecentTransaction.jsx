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
      <TableTitle>Latest Transactions</TableTitle>

      {isLoading ? (
        <LoadingRow>
          <Spinner />
          <span>Fetching transactions...</span>
        </LoadingRow>
      ) : (
        <>
          <TransactionHeader>
            <p>Date</p>
            <p>Total</p>
            <p>Delivery</p>
          </TransactionHeader>

          {orders?.map((order, index) => (
            <Transaction key={index}>
              <p>{moment(order.createdAt).format("DD/MM")}</p>
              <TotalCell>{order.total.toLocaleString("vi-VN")}₫</TotalCell>
              <StatusBadge $status={order.delivery_status}>
                {order.delivery_status}
              </StatusBadge>
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

const COLS = "0.8fr 1.1fr 1.3fr";

const StyledTransactions = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  animation: ${fadeIn} 0.4s ease;
`;

const TableTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem;
`;

const TransactionHeader = styled.div`
  display: grid;
  grid-template-columns: ${COLS};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #94a3b8;
  padding: 0 0.25rem 0.5rem;
  border-bottom: 1px solid #f1f5f9;

  p {
    margin: 0;
  }
`;

const Transaction = styled.div`
  display: grid;
  grid-template-columns: ${COLS};
  align-items: center;
  font-size: 13px;
  padding: 0.6rem 0.25rem;
  border-bottom: 1px solid #f8fafc;
  border-radius: 6px;
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8fafc;
  }

  p {
    margin: 0;
    color: #475569;
  }
`;

const TotalCell = styled.p`
  font-weight: 700;
  color: #0f172a !important;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
  width: fit-content;

  background: ${({ $status }) =>
    $status === "pending"
      ? "#fefce8"
      : $status === "delivered"
        ? "#f0fdf4"
        : "#fef2f2"};

  color: ${({ $status }) =>
    $status === "pending"
      ? "#ca8a04"
      : $status === "delivered"
        ? "#16a34a"
        : "#dc2626"};

  border: 1px solid
    ${({ $status }) =>
      $status === "pending"
        ? "#fde68a"
        : $status === "delivered"
          ? "#bbf7d0"
          : "#fecaca"};
`;

const PaymentBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
  width: fit-content;

  background: ${({ $status }) => ($status === "paid" ? "#f0fdf4" : "#fef2f2")};

  color: ${({ $status }) => ($status === "paid" ? "#16a34a" : "#dc2626")};

  border: 1px solid
    ${({ $status }) => ($status === "paid" ? "#bbf7d0" : "#fecaca")};
`;

const LoadingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1.5rem 0.25rem;
  color: #94a3b8;
  font-size: 13px;
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #e2e8f0;
  border-top-color: #1d4ed8;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const EmptyState = styled.p`
  text-align: center;
  padding: 2rem 0;
  color: #94a3b8;
  font-size: 13px;
`;
