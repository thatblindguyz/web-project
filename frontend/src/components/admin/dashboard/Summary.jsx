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

  // function compare(a, b) {
  //   if (a._id < b._id) return 1;
  //   if (a._id > b._id) return -1;
  //   return 0;
  // }

  /* ================= USER STATS ================= */
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/user-stats/stats`, setHeaders());
        // const sorted = res.data.sort(compare);
        setUsers(res.data);

        if (res.data.length >= 2) {
          const percent =
            ((res.data[0].total - res.data[1].total) / res.data[1].total) * 100;

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
        // const sorted = res.data.sort(compare);
        setOrders(res.data);

        if (res.data.length >= 2) {
          const percent =
            ((res.data[0].total - res.data[1].total) / res.data[1].total) * 100;

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
        // const sorted = res.data.sort(compare);
        setIncome(res.data);

        if (res.data.length >= 2) {
          const percent =
            ((res.data[0].total - res.data[1].total) / res.data[1].total) * 100;

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
      title: "Người dùng",
      percentage: usersPerc,
      lastMonth: users[1]?.total,
      onClick: () => navigate("/admin/users"),
    },
    {
      icon: <FaClipboard />,
      digit: orders[0]?.total,
      title: "Đơn hàng",
      percentage: ordersPerc,
      lastMonth: orders[1]?.total,
      onClick: () => navigate("/admin/orders"),
    },
    {
      icon: <FaChartBar />,
      digit: income[0]?.total,
      title: "Doanh thu",
      lastMonth: income[1]?.total,
      percentage: incomePerc,
      isMoney: true,
    },
  ];

  return (
    <Wrapper>
      <MainStats>
        {/* ===== OVERVIEW ===== */}
        <Overview>
          <OverviewHeader>
            <OverviewTitle>Tổng quan</OverviewTitle>
            <OverviewSub>
              {" "}
              Nhấn vào Người dùng hoặc Đơn hàng để xem chi tiết.
            </OverviewSub>
          </OverviewHeader>

          <WidgetWrapper>
            {data.map((item, index) => (
              <WidgetCard
                key={index}
                onClick={item.onClick}
                $clickable={!!item.onClick}
              >
                <Widget data={item} />
              </WidgetCard>
            ))}
          </WidgetWrapper>
        </Overview>

        {/* ===== CHART ===== */}
        <ChartWrapper>
          <Chart />
        </ChartWrapper>
      </MainStats>

      {/* ===== SIDE ===== */}
      <SideStats>
        <RecentTransaction />
        <AllTimeData />
      </SideStats>
    </Wrapper>
  );
};

export default Summary;

/* ================= STYLES ================= */

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
`;

const MainStats = styled.div`
  flex: 3;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SideStats = styled.div`
  flex: 1.2;
  min-width: 260px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Overview = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
`;

const OverviewHeader = styled.div`
  margin-bottom: 1.25rem;
`;

const OverviewTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px;
`;

const OverviewSub = styled.p`
  font-size: 13px;
  color: #64748b;
  margin: 0;
`;

const WidgetWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
`;

const WidgetCard = styled.div`
  flex: 1;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1.25rem;
  cursor: ${(p) => (p.$clickable ? "pointer" : "default")};
  transition:
    box-shadow 0.15s,
    border-color 0.15s;

  &:hover {
    box-shadow: ${(p) =>
      p.$clickable ? "0 4px 12px rgba(0,0,0,0.08)" : "none"};
    border-color: ${(p) => (p.$clickable ? "#bfdbfe" : "#e2e8f0")};
  }
`;

const ChartWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
`;
