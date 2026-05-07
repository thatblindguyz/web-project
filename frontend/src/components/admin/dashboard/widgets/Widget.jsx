import styled from "styled-components";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const Widget = ({ data }) => {
  return (
    <StyledWidget>
      <TopRow>
        <Icon>{data.icon}</Icon>
        <Text>
          <h3>
            {data.isMoney
              ? data.digit?.toLocaleString("vi-VN") + "₫"
              : data.digit?.toLocaleString()}
          </h3>
          <p>{data.title}</p>
        </Text>
      </TopRow>

      <BottomRow>
        <LastMonth>
          Số liệu tháng trước:{" "}
          {data.isMoney
            ? (data.lastMonth || 0).toLocaleString("vi-VN") + "₫"
            : (data.lastMonth || 0).toLocaleString()}
        </LastMonth>
        <Percentage $positive={data.percentage >= 0}>
          {data.percentage >= 0 ? <FaArrowUp /> : <FaArrowDown />}
          {Math.abs(Math.floor(data.percentage)) + "%"}
        </Percentage>
      </BottomRow>
    </StyledWidget>
  );
};

export default Widget;

/* ================= STYLES ================= */

const StyledWidget = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.25rem 0;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const Icon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1d4ed8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
    margin: 0;
  }
`;

const Percentage = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 6px;
  flex-shrink: 0;
  background: ${(p) => (p.$positive ? "#f0fdf4" : "#fef2f2")};
  color: ${(p) => (p.$positive ? "#16a34a" : "#dc2626")};
  border: 1px solid ${(p) => (p.$positive ? "#bbf7d0" : "#fecaca")};
`;

const LastMonth = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;
