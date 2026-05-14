import styled from "styled-components";
import { Outlet, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUsers, FaStore, FaClipboard, FaTachometerAlt } from "react-icons/fa";

const Dashboard = () => {
  const auth = useSelector((state) => state.auth);
  if (!auth.isAdmin) return <p>Access denied. Not an Admin!</p>;

  return (
    <StyledDashboard>
      <SideNav>
        <NavTitle>Quick Links</NavTitle>

        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="/admin/summary"
        >
          <FaTachometerAlt /> Tổng quan
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="/admin/products"
        >
          <FaStore /> Sản phẩm
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="/admin/orders"
        >
          <FaClipboard /> Đơn hàng
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="/admin/users"
        >
          <FaUsers /> Người dùng
        </NavLink>
      </SideNav>

      <Content>
        <Outlet />
      </Content>
    </StyledDashboard>
  );
};

export default Dashboard;

/* ================= STYLES ================= */

const StyledDashboard = styled.div`
  display: flex;
  height: 100vh;
`;

const SideNav = styled.div`
  border-right: 1px solid #e2e8f0;
  height: calc(100vh - 70px);
  position: fixed;
  overflow-y: auto;
  width: 220px;
  display: flex;
  flex-direction: column;
  padding: 1.8rem 1.2rem;
  background: #ffffff;

  a {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    margin-bottom: 4px;
    font-size: 18px;
    font-weight: 500;
    color: #64748b;
    padding: 9px 12px;
    border-radius: 8px;
    transition: 0.15s;

    svg {
      font-size: 19px;
      flex-shrink: 0;
    }
  }

  .link-active {
    background-color: #eff6ff;
    color: #1d4ed8;
    font-weight: 600;
    border: 0.5px solid #93c5fd;
  }

  .link-inactive:hover {
    background-color: #f8fafc;
    color: #1e293b;
  }
`;

const NavTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 14px;
  padding: 0 12px;
`;

const Content = styled.div`
  margin-left: 220px;
  padding: 2rem 3rem;
  width: 100%;
  min-height: 100vh;
  background: #f8fafc;
`;
