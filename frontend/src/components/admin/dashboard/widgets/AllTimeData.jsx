import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { url, setHeaders } from "../../../../features/api";

const AllTimeData = () => {
  const [users, setUsers] = useState(0);
  const [products, setProducts] = useState(0);
  const [orders, setOrders] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const usersRes = await axios.get(`${url}/users`, setHeaders());
        setUsers(usersRes.data.length || 0);

        const productsRes = await axios.get(`${url}/products`, setHeaders());
        setProducts(productsRes.data.length || 0);

        const ordersRes = await axios.get(`${url}/orders`, setHeaders());
        setOrders(ordersRes.data.length || 0);

        const incomeRes = await axios.get(`${url}/income/all`, setHeaders());
        setEarnings(incomeRes.data.length > 0 ? incomeRes.data[0].total : 0);
      } catch (err) {
        console.log("AllTimeData ERROR:", err);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const rows = [
    { label: "Users", value: users },
    { label: "Products", value: products },
    { label: "Orders", value: orders },
    {
      label: "Earnings",
      value: `${earnings.toLocaleString("vi-VN")}₫`,
    },
  ];

  return (
    <Main>
      <SectionTitle>All Time</SectionTitle>

      {loading ? (
        <LoadingText>Loading...</LoadingText>
      ) : (
        rows.map((row) => (
          <Info key={row.label}>
            <Label>{row.label}</Label>
            <Value>{row.value}</Value>
          </Info>
        ))
      )}
    </Main>
  );
};

export default AllTimeData;

/* ================= STYLES ================= */

const Main = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  transition: border-color 0.15s;

  &:hover {
    border-color: #bfdbfe;
  }
`;

const Label = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #475569;
`;

const Value = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
`;

const LoadingText = styled.p`
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
`;
