import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { logoutUser } from "../../../features/auth/AuthSlice";
import { toast } from "react-toastify";
import { useState } from "react";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartTotalQuantity } = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <Nav>
      {/* LOGO */}
      <Link to="/">
        <Logo>TECHCOM</Logo>
      </Link>

      {/* SEARCH */}
      <SearchForm onSubmit={handleSearch}>
        <SearchInput
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SearchButton type="submit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.156a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" />
          </svg>
        </SearchButton>
      </SearchForm>

      {/* CART */}
      <Link to="/cart">
        <CartWrapper>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 1a2 2 0 0 0-2 2v2H5V3a3 3 0 1 1 6 0v2h-1V3a2 2 0 0 0-2-2zM5 5H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5H11v1.5a.5.5 0 0 1-1 0V5H6v1.5a.5.5 0 0 1-1 0V5z" />
          </svg>
          {cartTotalQuantity > 0 && <CartBadge>{cartTotalQuantity}</CartBadge>}
        </CartWrapper>
      </Link>

      {/* AUTH */}
      {auth._id ? (
        <Links>
          {auth.isAdmin && <Link to="/admin/summary">Admin</Link>}
          {!auth.isAdmin && <Link to="/my-orders">My Orders</Link>}
          <LogoutBtn
            onClick={() => {
              dispatch(logoutUser());
              toast.warning("Logged out!", { position: "bottom-left" });
            }}
          >
            Logout
          </LogoutBtn>
        </Links>
      ) : (
        <AuthLinks>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </AuthLinks>
      )}
    </Nav>
  );
};

export default NavBar;

/* ================= STYLES ================= */

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0 2rem;
  height: 64px;
  background: #0f172a;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.h2`
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.04em;
  white-space: nowrap;
`;

const SearchForm = styled.form`
  flex: 1;
  max-width: 420px;
  display: flex;
  align-items: center;
  background: #1e293b;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.15s;

  &:focus-within {
    border-color: #93c5fd;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  height: 36px;
  padding: 0 12px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: #f1f5f9;

  &::placeholder {
    color: #94a3b8;
  }
`;

const SearchButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  width: 38px;
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: #1d4ed8;
  }
`;

const CartWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  color: #f1f5f9;
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #1d4ed8;
  color: white;
  font-size: 11px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-left: auto;

  a {
    font-size: 14px;
    font-weight: 500;
    color: #cbd5e1;
    text-decoration: none;

    &:hover {
      color: #1d4ed8;
    }
  }
`;

const LogoutBtn = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #fca5a5;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const AuthLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;

  a {
    font-size: 14px;
    font-weight: 500;
    color: #cbd5e1;
    text-decoration: none;

    &:last-child {
      background: #1d4ed8;
      color: white;
      padding: 6px 14px;
      border-radius: 8px;

      &:hover {
        opacity: 0.88;
      }
    }
  }
`;
