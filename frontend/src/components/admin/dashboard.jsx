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
        <h3>Quick Links</h3>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="/admin/summary"
        >
          <FaTachometerAlt size={22} /> Summary
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="/admin/products"
        >
          <FaStore size={22} /> Products
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="/admin/orders"
        >
          <FaClipboard size={22} /> Orders
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="/admin/users"
        >
          <FaUsers size={22} /> Users
        </NavLink>
      </SideNav>
      <Content>
        <Outlet />
      </Content>
    </StyledDashboard>
  );
};

export default Dashboard;

const StyledDashboard = styled.div`
  display: flex;
  height: 100vh;
`;

const SideNav = styled.div`
  border-right: 1px solid gray;

  height: calc(100vh - 70px);

  position: fixed;

  overflow-y: auto;

  width: 220px;

  display: flex;
  flex-direction: column;

  padding: 2rem;

  h3 {
    margin-bottom: 1.5rem;

    text-transform: uppercase;

    font-size: 18px;
  }

  a {
    display: flex;
    align-items: center;

    gap: 12px;

    text-decoration: none;

    margin-bottom: 1.2rem;

    font-size: 16px;

    padding: 8px 10px;

    border-radius: 6px;

    svg {
      font-size: 20px;
    }
  }

  .link-active {
    background: rgba(102, 108, 255, 0.2);
    font-weight: 700;
  }

  .link-inactive:hover {
    background: rgba(102, 108, 255, 0.1);
  }
`;

const Content = styled.div`
  margin-left: 220px;

  padding: 2rem 3rem;

  width: 100%;

  min-height: 100vh;

  background: #f5f6fa;
`;
