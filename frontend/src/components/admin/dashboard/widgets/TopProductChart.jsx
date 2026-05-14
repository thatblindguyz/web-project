import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import axios from "axios";
import { url, setHeaders } from "../../../../features/api";

/* ============================
   CUSTOM TOOLTIP
============================ */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <TooltipBox>
        <TooltipName>{payload[0].payload.name}</TooltipName>
        <TooltipValue>Đã bán: {payload[0].value} sản phẩm</TooltipValue>
      </TooltipBox>
    );
  }
  return null;
};

/* ============================
   COMPONENT
============================ */
const TopProductChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `${url}/products/top-products`,
          setHeaders(),
        );
        setData(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const COLORS = ["#1d4ed8", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];

  /* ================= TRUNCATE TÊN ================= */
  const truncate = (str, n = 18) =>
    str?.length > n ? str.slice(0, n) + "…" : str;

  return (
    <Wrapper>
      <Header>
        <Title>Top 5 sản phẩm bán chạy</Title>
        <Sub>Dựa trên tổng số lượng đã bán</Sub>
      </Header>

      {loading ? (
        <LoadingText>Đang tải...</LoadingText>
      ) : data.length === 0 ? (
        <LoadingText>Chưa có dữ liệu</LoadingText>
      ) : (
        <ChartArea>
          {/* ===== BAR CHART ===== */}
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={data}
              margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
              barSize={28}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                tickFormatter={(v) => truncate(v, 12)}
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar dataKey="totalSold" radius={[6, 6, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* ===== PRODUCT LIST ===== */}
          <ProductList>
            {data.map((item, index) => (
              <ProductRow key={item._id}>
                <RankBadge $index={index}>{index + 1}</RankBadge>
                <ProductImg src={item.image} alt={item.name} />
                <ProductInfo>
                  <ProductName>{item.name}</ProductName>
                  <ProductPrice>
                    {item.price?.toLocaleString("vi-VN")}₫
                  </ProductPrice>
                </ProductInfo>
                <SoldBadge>{item.totalSold} đã bán</SoldBadge>
              </ProductRow>
            ))}
          </ProductList>
        </ChartArea>
      )}
    </Wrapper>
  );
};

export default TopProductChart;

/* ================= STYLES ================= */
const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
`;

const Header = styled.div`
  margin-bottom: 1.25rem;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px;
`;

const Sub = styled.p`
  font-size: 13px;
  color: #64748b;
  margin: 0;
`;

const LoadingText = styled.p`
  font-size: 13px;
  color: #94a3b8;
  text-align: center;
  padding: 2rem 0;
  margin: 0;
`;

const ChartArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

/* ===== TOOLTIP ===== */
const TooltipBox = styled.div`
  background: #1e293b;
  border-radius: 8px;
  padding: 8px 12px;
`;

const TooltipName = styled.p`
  font-size: 12px;
  color: #94a3b8;
  margin: 0 0 2px;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TooltipValue = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0;
`;

/* ===== PRODUCT LIST ===== */
const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProductRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  transition: border-color 0.15s;

  &:hover {
    border-color: #e2e8f0;
  }
`;

const RankBadge = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  background: ${(p) =>
    p.$index === 0
      ? "#fef9c3"
      : p.$index === 1
        ? "#f1f5f9"
        : p.$index === 2
          ? "#fef2f2"
          : "#f8fafc"};
  color: ${(p) =>
    p.$index === 0
      ? "#854d0e"
      : p.$index === 1
        ? "#475569"
        : p.$index === 2
          ? "#a32d2d"
          : "#64748b"};
`;

const ProductImg = styled.img`
  width: 38px;
  height: 38px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  flex-shrink: 0;
`;

const ProductInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProductName = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductPrice = styled.p`
  font-size: 12px;
  color: #64748b;
  margin: 0;
`;

const SoldBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #1d4ed8;
  background: #eff6ff;
  border: 0.5px solid #bfdbfe;
  border-radius: 6px;
  padding: 2px 8px;
  flex-shrink: 0;
  white-space: nowrap;
`;
