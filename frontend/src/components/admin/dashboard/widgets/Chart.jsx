import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";
import axios from "axios";
import { url, setHeaders } from "../../../../features/api";

const Chart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/orders/week-sales`, setHeaders());
        const days = [];

        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);

          const formatted = date.getDate() + "/" + (date.getMonth() + 1);

          days.push({
            name: formatted,
            label: `Date : ${formatted}`,
            sales: 0,
            orders: 0,
          });
        }

        res.data.forEach((item) => {
          const dayIndex = days.findIndex((d) => d.name === String(item._id));

          if (dayIndex !== -1) {
            days[dayIndex].sales = item.total ? item.total / 100 : 0;

            days[dayIndex].orders = item.count ? item.count : 0;
          }
        });

        setData(days);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  return (
    <StyledChart>
      <h3>Last 7 Days Sales</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="label" />

          <YAxis />

          <Tooltip
            formatter={(value, name) => {
              if (name === "Revenue ($)") {
                return [`$${value.toLocaleString()}`, name];
              }
              return [value, name];
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#4b70e2"
            name="Revenue ($)"
          />

          <Line
            type="monotone"
            dataKey="orders"
            stroke="#82ca9d"
            name="Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </StyledChart>
  );
};

export default Chart;

/* ================= STYLES ================= */

const StyledChart = styled.div`
  width: 100%;
  margin-top: 2rem;
  padding: 1rem;

  border: 2px solid rgba(48, 51, 78, 0.2);
  border-radius: 5px;

  h3 {
    margin-bottom: 1rem;
  }
`;
