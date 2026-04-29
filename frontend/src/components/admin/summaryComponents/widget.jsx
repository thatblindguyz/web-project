import styled from "styled-components";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const Widget = ({ data }) => {
  return (
    <StyledWidget>
      {/* ICON */}
      <Icon color={data.color} bgcolor={data.bgColor}>
        {data.icon}
      </Icon>

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
      <Percentage isPositive={data.percentage >= 0}>
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
  padding: 0.5rem 0;
`;

const Icon = styled.div`
  margin-right: 0.5rem;
  padding: 0.5rem;
  color: ${({ color }) => color};
  background: ${({ bgcolor }) => bgcolor};
  border-radius: 3px;
  font-size: 20px;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  h3 {
    font-weight: 900;
  }

  p {
    font-size: 14px;
    color: rgba(234, 234, 255, 0.68);
  }
`;

const Percentage = styled.div`
  margin-left: auto;

  display: flex;
  align-items: center;
  gap: 5px;

  font-size: 14px;

  color: ${({ isPositive }) =>
    isPositive ? "rgb(114,225,40)" : "rgb(255,77,73)"};
`;
