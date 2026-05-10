import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { logoutUser } from "../../../features/auth/AuthSlice";
import { clearCart, resetCart } from "../../../features/cart/CartSlice";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import { persistor } from "../../../features/Store";
import axios from "axios";
import { url, setHeaders } from "../../../features/api";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartTotalQuantity, cartItems } = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");

  // Thông báo chat cho admin
  const [unreadCount, setUnreadCount] = useState(0);
  const prevLastMessages = useRef({});

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(search.trim())}`);
  };

  /* ================= POLLING CHAT CHO ADMIN ================= */
  useEffect(() => {
    if (!auth?.isAdmin) return;

    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `${url}/chat/admin/conversations`,
          setHeaders(),
        );
        const conversations = res.data;

        let newUnread = 0;
        conversations.forEach((conv) => {
          const prevLast = prevLastMessages.current[conv._id];
          if (prevLast !== undefined && prevLast !== conv.lastMessage) {
            newUnread++;
          }
          prevLastMessages.current[conv._id] = conv.lastMessage;
        });

        if (newUnread > 0) {
          setUnreadCount((prev) => prev + newUnread);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 3000);
    return () => clearInterval(interval);
  }, [auth?.isAdmin]);

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
          {auth.isAdmin && (
            <>
              {/* NOTIFICATION */}
              <BellWrapper
                onClick={() => {
                  setUnreadCount(0);
                  navigate("/admin/chat");
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <BellBadge>{unreadCount > 9 ? "9+" : unreadCount}</BellBadge>
                )}
              </BellWrapper>

              <Link to="/admin/summary">Admin</Link>
            </>
          )}

          {!auth.isAdmin && <Link to="/my-orders">My Orders</Link>}
          <UserGreeting>Xin chào, {auth.name}</UserGreeting>
          <LogoutBtn
            onClick={() => {
              localStorage.setItem(
                `cart_${auth._id}`,
                JSON.stringify(cartItems),
              );
              dispatch(resetCart());
              dispatch(logoutUser());
              toast.warning("Logged out!", { position: "bottom-left" });
              navigate("/");
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

const BellWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: #cbd5e1;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #f8fafc;
  }
`;

const BellBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  background: #dc2626;
  color: white;
  font-size: 10px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
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

const UserGreeting = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #f8fafc;
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
