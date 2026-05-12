import styled from "styled-components";
import {
  ComposedChart,
  Bar,
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
            label: `Ngày ${formatted}`,
            sales: 0,
            orders: 0,
          });
        }
        res.data.forEach((item) => {
          const dayIndex = days.findIndex((d) => d.name === String(item._id));
          if (dayIndex !== -1) {
            days[dayIndex].sales = item.total || 0;
            days[dayIndex].orders = item.count || 0;
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
      <h3>Doanh thu 7 ngày vừa qua</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />

          {/* Trục Y trái: doanh thu */}
          <YAxis
            yAxisId="left"
            tickFormatter={(v) =>
              v >= 1_000_000
                ? `${(v / 1_000_000).toFixed(1)}tr`
                : v >= 1_000
                  ? `${(v / 1_000).toFixed(0)}k`
                  : v
            }
          />

          {/* Trục Y phải: số đơn */}
          <YAxis yAxisId="right" orientation="right" allowDecimals={false} />

          <Tooltip
            formatter={(value, name) => {
              if (name === "Doanh Thu (₫)")
                return [`${value.toLocaleString("vi-VN")}₫`, name];
              return [value, name];
            }}
          />
          <Legend />

          {/* Cột xanh đậm: doanh thu */}
          <Bar
            yAxisId="left"
            dataKey="sales"
            name="Doanh Thu (₫)"
            fill="#4b70e2"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />

          {/* Đường xanh lá: số đơn hàng */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            name="Số đơn hàng"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </StyledChart>
  );
};

export default Chart;

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
