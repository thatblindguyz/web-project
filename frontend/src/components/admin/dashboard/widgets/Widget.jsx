import styled from "styled-components";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const Widget = ({ data }) => {
  return (
    <StyledWidget>
      {/* ICON */}
      <Icon>{data.icon}</Icon>

      {/* TEXT */}
      <Text>
        <h3>
          {data.isMoney
            ? "$" + data.digit?.toLocaleString()
            : data.digit?.toLocaleString()}
        </h3>
        <p>{data.title}</p>
      </Text>

      {/* PERCENTAGE */}
      <Percentage $positive={data.percentage >= 0}>
        {data.percentage >= 0 ? <FaArrowUp /> : <FaArrowDown />}
        {Math.abs(Math.floor(data.percentage)) + "%"}
      </Percentage>
    </StyledWidget>
  );
};

export default Widget;

/* ================= STYLES ================= */

const StyledWidget = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.25rem 0;
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1d4ed8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  h3 {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }

  p {
    font-size: 13px;
    font-weight: 500;
    color: #64748b;
    margin: 0;
  }
`;

const Percentage = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  background: ${(p) => (p.$positive ? "#f0fdf4" : "#fef2f2")};
  color: ${(p) => (p.$positive ? "#16a34a" : "#dc2626")};
  border: 1px solid ${(p) => (p.$positive ? "#bbf7d0" : "#fecaca")};
`;
