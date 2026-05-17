import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  FaFileExcel,
  FaDownload,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { url, setHeaders } from "../../../features/api";

const ExportExcel = () => {
  const [timeRange, setTimeRange] = useState("7days");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const response = await fetch(`${url}/export-orders?time=${timeRange}`, {
        headers: setHeaders().headers,
      });

      if (!response.ok) throw new Error("API lỗi");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "orders.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("❌ Export lỗi:", error);
      alert("Export thất bại");
    } finally {
      setLoading(false);
    }
  };

  const ranges = [
    { value: "7days", label: "7 ngày gần đây" },
    { value: "30days", label: "30 ngày gần đây" },
    { value: "all", label: "Tất cả dữ liệu" },
  ];

  return (
    <Wrapper>
      <Header>
        <IconWrap>
          <FaFileExcel size={32} color="#1D6F42" />
        </IconWrap>
        <div>
          <Title>Export Excel</Title>
          <Subtitle>Xuất dữ liệu đơn hàng ra file Excel</Subtitle>
        </div>
      </Header>

      <Card>
        <SectionLabel>
          <FaCalendarAlt size={14} />
          Chọn khoảng thời gian
        </SectionLabel>

        <OptionGroup>
          {ranges.map((r) => (
            <OptionCard
              key={r.value}
              active={timeRange === r.value}
              onClick={() => setTimeRange(r.value)}
            >
              <Radio active={timeRange === r.value} />
              {r.label}
            </OptionCard>
          ))}
        </OptionGroup>

        <Divider />

        <InfoBox>
          <InfoRow>
            <span>Định dạng</span>
            <Tag>.xlsx (Microsoft Excel)</Tag>
          </InfoRow>
          <InfoRow>
            <span>Dữ liệu</span>
            <Tag>Đơn hàng, trạng thái, tổng tiền</Tag>
          </InfoRow>
        </InfoBox>

        <ExportBtn onClick={handleExport} disabled={loading} success={success}>
          {loading ? (
            <>
              <Spinner /> Đang xuất...
            </>
          ) : success ? (
            <>
              <FaCheckCircle /> Xuất thành công!
            </>
          ) : (
            <>
              <FaDownload /> Xuất Excel
            </>
          )}
        </ExportBtn>
      </Card>
    </Wrapper>
  );
};

export default ExportExcel;

/* ============ STYLED COMPONENTS ============ */
const Wrapper = styled.div`
  max-width: 540px;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
`;
const IconWrap = styled.div`
  background: rgba(29, 111, 66, 0.15);
  border-radius: 14px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Title = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1e1e2f;
`;
const Subtitle = styled.p`
  margin: 4px 0 0;
  color: #888;
  font-size: 14px;
`;
const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
`;
const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 14px;
`;
const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const OptionCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  border: 2px solid ${(p) => (p.active ? "#666cff" : "#eee")};
  background: ${(p) => (p.active ? "rgba(102,108,255,0.06)" : "#fafafa")};
  cursor: pointer;
  font-size: 15px;
  font-weight: ${(p) => (p.active ? "600" : "400")};
  color: ${(p) => (p.active ? "#666cff" : "#333")};
  transition: all 0.2s;
  &:hover {
    border-color: #666cff;
    background: rgba(102, 108, 255, 0.04);
  }
`;
const Radio = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${(p) => (p.active ? "#666cff" : "#ccc")};
  background: ${(p) => (p.active ? "#666cff" : "transparent")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
  &::after {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #fff;
    display: ${(p) => (p.active ? "block" : "none")};
  }
`;
const Divider = styled.div`
  height: 1px;
  background: #f0f0f0;
  margin: 20px 0;
`;
const InfoBox = styled.div`
  background: #f8f9ff;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
`;
const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #666;
`;
const Tag = styled.span`
  background: #ececff;
  color: #666cff;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
`;
const spin = keyframes`
  to { transform: rotate(360deg); }
`;
const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;
const ExportBtn = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.25s;
  background: ${(p) =>
    p.success
      ? "#1D6F42"
      : p.disabled
        ? "#aaa"
        : "linear-gradient(135deg, #666cff, #9c6bff)"};
  color: #fff;
  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(102, 108, 255, 0.35);
  }
`;
