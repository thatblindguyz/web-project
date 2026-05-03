import { useEffect, useState } from "react";
import styled from "styled-components";

import { FaUsers, FaChartBar, FaClipboard } from "react-icons/fa";

import axios from "axios";

import { url, setHeaders } from "../../../features/api";

import Widget from "./widgets/Widget";
import Chart from "./widgets/Chart";
import RecentTransaction from "./widgets/RecentTransaction";
import AllTimeData from "./widgets/AllTimeData";

import { useNavigate } from "react-router-dom";

const Summary = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [usersPerc, setUsersPerc] = useState(0);

  const [orders, setOrders] = useState([]);
  const [ordersPerc, setOrdersPerc] = useState(0);

  const [income, setIncome] = useState([]);
  const [incomePerc, setIncomePerc] = useState(0);

  function compare(a, b) {
    if (a._id < b._id) return 1;
    if (a._id > b._id) return -1;
    return 0;
  }

  /* ================= USER STATS ================= */

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/users/stats`, setHeaders());

        const sorted = res.data.sort(compare);

        setUsers(sorted);

        if (sorted.length >= 2) {
          const percent =
            ((sorted[0].total - sorted[1].total) / sorted[1].total) * 100;

          setUsersPerc(Math.floor(percent));
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  /* ================= ORDER STATS ================= */

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/orders/stats`, setHeaders());

        const sorted = res.data.sort(compare);

        setOrders(sorted);

        if (sorted.length >= 2) {
          const percent =
            ((sorted[0].total - sorted[1].total) / sorted[1].total) * 100;

          setOrdersPerc(Math.floor(percent));
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  /* ================= INCOME STATS ================= */

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/income/stats`, setHeaders());

        const sorted = res.data.sort(compare);

        setIncome(sorted);

        if (sorted.length >= 2) {
          const percent =
            ((sorted[0].total - sorted[1].total) / sorted[1].total) * 100;

          setIncomePerc(Math.floor(percent));
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  /* ================= WIDGET DATA ================= */

  const data = [
    {
      icon: <FaUsers />,
      digit: users[0]?.total,
      title: "Users",
      percentage: usersPerc,
      onClick: () => navigate("/admin/users"),
    },

    {
      icon: <FaClipboard />,
      digit: orders[0]?.total,
      title: "Orders",
      percentage: ordersPerc,
      onClick: () => navigate("/admin/orders"),
    },

    {
      icon: <FaChartBar />,
      digit: income[0]?.total,
      title: "Earnings",
      percentage: incomePerc,
    },
  ];

  return (
    <StyledSummary>
      <MainStats>
        <Overview>
          <Title>
            <h2>Overview</h2>

            <p>Click Users or Orders to view details.</p>
          </Title>

          <WidgetWrapper>
            {data.map((item, index) => (
              <div
                key={index}
                onClick={item.onClick}
                style={{
                  cursor: "pointer",
                }}
              >
                <Widget data={item} />
              </div>
            ))}
          </WidgetWrapper>
        </Overview>

        <ChartWrapper>
          <Chart />
        </ChartWrapper>
      </MainStats>

      <SideStats>
        <RecentTransaction />

        <AllTimeData />
      </SideStats>
    </StyledSummary>
  );
};

export default Summary;

/* ================= STYLES ================= */

const StyledSummary = styled.div`
  width: 100%;
  display: flex;

  gap: 2rem;
`;

const MainStats = styled.div`
  flex: 2;

  display: flex;
  flex-direction: column;

  gap: 2rem;
`;

const SideStats = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;

  height: fit-content;
`;

const Overview = styled.div`
  background: rgb(48, 51, 78);
  color: rgba(234, 234, 255, 0.87);

  width: 100%;
  padding: 1.5rem;

  border-radius: 10px;

  display: flex;
  flex-direction: column;
`;

const WidgetWrapper = styled.div`
  display: flex;

  justify-content: space-between;

  gap: 2rem;

  margin-top: 1rem;
`;

const ChartWrapper = styled.div`
  background: white;

  padding: 1rem;

  border-radius: 10px;

  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const Title = styled.div`
  p {
    font-size: 14px;
    color: rgba(234, 234, 255, 0.68);
  }
`;
