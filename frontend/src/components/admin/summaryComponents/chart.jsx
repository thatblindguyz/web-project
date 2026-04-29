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
import { url, setHeaders } from "../../../features/api";

const Chart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/orders/week-sales`, setHeaders());

        const days = [
          { name: "Mon", sales: 0 },
          { name: "Tue", sales: 0 },
          { name: "Wed", sales: 0 },
          { name: "Thu", sales: 0 },
          { name: "Fri", sales: 0 },
          { name: "Sat", sales: 0 },
          { name: "Sun", sales: 0 },
        ];

        res.data.forEach((item) => {
          const index = item._id - 1;
          days[index].sales = item.total;
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

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="sales"
            stroke="#4b70e2"
            activeDot={{ r: 8 }}
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
