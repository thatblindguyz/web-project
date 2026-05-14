import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { logoutUser } from "../../../features/auth/AuthSlice";
import { resetCart } from "../../../features/cart/CartSlice";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { url, setHeaders } from "../../../features/api";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartTotalQuantity, cartItems } = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const prevLastMessages = useRef({});
  const [orderCount, setOrderCount] = useState(0);
  const prevOrderRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(search.trim())}`);
  };

  /* ================= POLLING CHAT ================= */
  useEffect(() => {
    if (!auth?.isAdmin) return;
    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `${url}/chat/admin/conversations`,
          setHeaders(),
        );
        let newUnread = 0;
        res.data.forEach((conv) => {
          const prevLast = prevLastMessages.current[conv._id];
          if (prevLast !== undefined && prevLast !== conv.lastMessage)
            newUnread++;
          prevLastMessages.current[conv._id] = conv.lastMessage;
        });
        if (newUnread > 0) setUnreadCount((prev) => prev + newUnread);
      } catch (err) {
        console.log(err);
      }
    };
    fetchConversations();
    const interval = setInterval(fetchConversations, 3000);
    return () => clearInterval(interval);
  }, [auth?.isAdmin]);

  /* ================= POLLING ORDER ================= */
  useEffect(() => {
    if (!auth?.isAdmin) return;
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${url}/orders?new=true`, setHeaders());
        const latestOrder = res.data?.[0]?._id;
        if (prevOrderRef.current && prevOrderRef.current !== latestOrder) {
          setOrderCount((prev) => prev + 1);
          toast.info("Có đơn hàng mới!", { position: "top-right" });
        }
        prevOrderRef.current = latestOrder;
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
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
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SearchButton type="submit">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </SearchButton>
      </SearchForm>

      {/* CART */}
      <Link to="/cart">
        <CartWrapper>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {cartTotalQuantity > 0 && <CartBadge>{cartTotalQuantity}</CartBadge>}
        </CartWrapper>
      </Link>

      {/* AUTH */}
      {auth._id ? (
        <Links>
          {auth.isAdmin && (
            <>
              {/* CHAT ICON */}
              <IconBtn
                title="Tin nhắn"
                onClick={() => {
                  setUnreadCount(0);
                  navigate("/admin/chat");
                }}
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {unreadCount > 0 && (
                  <IconBadge>{unreadCount > 9 ? "9+" : unreadCount}</IconBadge>
                )}
              </IconBtn>

              {/* ORDER ICON */}
              <IconBtn
                title="Đơn hàng mới"
                onClick={() => {
                  setOrderCount(0);
                  navigate("/admin/orders");
                }}
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                {orderCount > 0 && (
                  <IconBadge>{orderCount > 9 ? "9+" : orderCount}</IconBadge>
                )}
              </IconBtn>

              <Link to="/admin/summary">Admin</Link>
            </>
          )}

          {!auth.isAdmin && <Link to="/my-orders">Đơn của tôi</Link>}
          <UserGreeting>Xin chào, {auth.name}</UserGreeting>
          <LogoutBtn
            onClick={() => {
              localStorage.setItem(
                `cart_${auth._id}`,
                JSON.stringify(cartItems),
              );
              dispatch(resetCart());
              dispatch(logoutUser());
              toast.warning("Đã đăng xuất!", { position: "bottom-left" });
              navigate("/");
            }}
          >
            Đăng xuất
          </LogoutBtn>
        </Links>
      ) : (
        <AuthLinks>
          <Link to="/login">Đăng nhập</Link>
          <Link to="/register">Đăng ký</Link>
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
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
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.15s;
  &:focus-within {
    border-color: #3b82f6;
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
    color: #475569;
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
  color: #475569;
  cursor: pointer;
  transition: color 0.15s;
  &:hover {
    color: #93c5fd;
  }
`;

const CartWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  color: #94a3b8;
  transition: color 0.15s;
  &:hover {
    color: #f1f5f9;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #1d4ed8;
  color: white;
  font-size: 10px;
  font-weight: 700;
  min-width: 17px;
  height: 17px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #0f172a;
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  a {
    font-size: 14px;
    font-weight: 500;
    color: #94a3b8;
    text-decoration: none;
    transition: color 0.15s;
    &:hover {
      color: #f1f5f9;
    }
  }
`;

const IconBtn = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  color: #94a3b8;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
  &:hover {
    background: rgba(255, 255, 255, 0.07);
    color: #f1f5f9;
  }
`;

const IconBadge = styled.span`
  position: absolute;
  top: 1px;
  right: 1px;
  background: #dc2626;
  color: white;
  font-size: 9px;
  font-weight: 700;
  min-width: 15px;
  height: 15px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  border: 1.5px solid #0f172a;
`;

const LogoutBtn = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #f87171;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover {
    opacity: 0.75;
  }
`;

const UserGreeting = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #cbd5e1;
`;

const AuthLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  a {
    font-size: 14px;
    font-weight: 500;
    color: #94a3b8;
    text-decoration: none;
    transition: color 0.15s;
    &:hover {
      color: #f1f5f9;
    }
    &:last-child {
      background: #1d4ed8;
      color: white;
      padding: 6px 14px;
      border-radius: 8px;
      &:hover {
        color: white;
        opacity: 0.88;
      }
    }
  }
`;
