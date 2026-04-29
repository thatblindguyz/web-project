import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

import { url, setHeaders } from "../../../features/api";

const AllTimeData = () => {
  const [users, setUsers] = useState(0);
  const [products, setProducts] = useState(0);
  const [orders, setOrders] = useState(0);
  const [earnings, setEarnings] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        /* ================= USERS ================= */

        const usersRes = await axios.get(`${url}/users`, setHeaders());

        console.log("Users:", usersRes.data);

        setUsers(usersRes.data.length || 0);

        /* ================= PRODUCTS ================= */

        const productsRes = await axios.get(`${url}/products`, setHeaders());

        console.log("Products:", productsRes.data);

        setProducts(productsRes.data.length || 0);

        /* ================= ORDERS ================= */

        const ordersRes = await axios.get(`${url}/orders`, setHeaders());

        console.log("Orders:", ordersRes.data);

        setOrders(ordersRes.data.length || 0);

        /* ================= EARNINGS ================= */

        const incomeRes = await axios.get(`${url}/income/all`, setHeaders());

        console.log("Income ALL:", incomeRes.data);

        setEarnings(incomeRes.data.length > 0 ? incomeRes.data[0].total : 0);
      } catch (err) {
        console.log("AllTimeData ERROR:", err);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  return (
    <Main>
      <h3>All Time</h3>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Info>
            <Title>Users</Title>
            <Data>{users}</Data>
          </Info>

          <Info>
            <Title>Products</Title>
            <Data>{products}</Data>
          </Info>

          <Info>
            <Title>Orders</Title>
            <Data>{orders}</Data>
          </Info>

          <Info>
            <Title>Earnings</Title>
            <Data>${earnings.toLocaleString()}</Data>
          </Info>
        </>
      )}
    </Main>
  );
};

export default AllTimeData;

/* ================= STYLES ================= */

const Main = styled.div`
  background: rgb(48, 51, 78);

  color: rgba(234, 234, 255, 0.87);

  margin-top: 1.5rem;

  border-radius: 8px;

  padding: 1rem;

  font-size: 14px;
`;

const Info = styled.div`
  display: flex;

  margin-top: 1rem;

  padding: 0.6rem;

  border-radius: 6px;

  background: rgba(38, 198, 249, 0.12);

  transition: 0.2s;

  &:nth-child(even) {
    background: rgba(102, 108, 255, 0.12);
  }

  &:hover {
    transform: scale(1.02);
  }
`;

const Title = styled.div`
  flex: 1;
`;

const Data = styled.div`
  flex: 1;

  font-weight: 700;

  text-align: right;
`;
