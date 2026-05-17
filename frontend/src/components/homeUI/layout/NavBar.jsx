import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { logoutUser } from "../../../features/auth/AuthSlice";
import { resetCart } from "../../../features/cart/CartSlice";
import { toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { url, setHeaders } from "../../../features/api";

const CATEGORIES = [
  { label: "Card đồ họa", key: "GPU" },
  { label: "Bộ vi xử lý", key: "CPU" },
  { label: "RAM", key: "RAM" },
  { label: "Màn hình", key: "Monitor" },
];

const NAV_LINKS = [
  { label: "Trang chủ", to: "/" },
  { label: "Khuyến mãi", to: "/?search=sale" },
  { label: "Bộ sưu tập", to: "/?search=" },
  { label: "Hướng dẫn", to: "#" },
  { label: "Tra cứu đơn hàng", to: "/my-orders" },
];

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartTotalQuantity, cartItems } = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const catRef = useRef(null);
  const userRef = useRef(null);

  /* ← MERGE từ file bạn: polling chat */
  const [unreadCount, setUnreadCount] = useState(0);
  const prevLastMessages = useRef({});

  /* ← MERGE từ file bạn: polling order */
  const [orderCount, setOrderCount] = useState(0);
  const prevOrderRef = useRef(null);

  /* Đóng dropdown khi click ra ngoài */
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target))
        setShowCategories(false);
      if (userRef.current && !userRef.current.contains(e.target))
        setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ← MERGE từ file bạn: polling chat */
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

  /* ← MERGE từ file bạn: polling order */
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

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(search.trim())}`);
  };

  const handleCategory = (key) => {
    navigate(`/?search=${encodeURIComponent(key)}`);
    setShowCategories(false);
  };

  return (
    <HeaderRoot>
      {/* ════════ TOP BAR ════════ */}
      <TopBar>
        <TopInner>
          <TopLeft>
            <TopItem>
              <svg
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Hotline: <strong>1900 1234</strong>
            </TopItem>
            <TopDivider />
            <TopItem>
              <svg
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              support@techcom.vn
            </TopItem>
          </TopLeft>
          <TopRight>
            <TopLink>Giới thiệu</TopLink>
            <TopLink>Tin tức</TopLink>
            <TopLink>Chính sách</TopLink>
            <TopLink>Liên hệ</TopLink>
          </TopRight>
        </TopInner>
      </TopBar>

      {/* ════════ MAIN NAV ════════ */}
      <MainNav>
        <MainInner>
          {/* LOGO */}
          <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <LogoWrap>
              <LogoIcon viewBox="0 0 36 36">
                <rect width="36" height="36" rx="7" fill="#1d4ed8" />
                <rect x="7" y="10" width="9" height="3" rx="1.5" fill="white" />
                <rect x="7" y="16" width="9" height="3" rx="1.5" fill="white" />
                <rect x="7" y="22" width="9" height="3" rx="1.5" fill="white" />
                <rect
                  x="20"
                  y="10"
                  width="9"
                  height="15"
                  rx="1.5"
                  fill="white"
                />
              </LogoIcon>
              <LogoText>
                <LogoName>TECHCOM</LogoName>
                <LogoSub>Linh kiện máy tính</LogoSub>
              </LogoText>
            </LogoWrap>
          </Link>

          {/* SEARCH */}
          <SearchWrap onSubmit={handleSearch}>
            <SearchInner>
              <SearchInput
                type="text"
                placeholder="Bạn cần tìm gì hôm nay?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <SearchBtn type="submit">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </SearchBtn>
            </SearchInner>
          </SearchWrap>

          {/* RIGHT ACTIONS */}
          <RightActions>
            {/* ← MERGE từ file bạn: chat + order badge cho admin */}
            {auth._id && auth.isAdmin && (
              <>
                <IconBtn
                  title="Tin nhắn"
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
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {unreadCount > 0 && (
                    <IconBadge>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </IconBadge>
                  )}
                </IconBtn>
                <IconBtn
                  title="Đơn hàng mới"
                  onClick={() => {
                    setOrderCount(0);
                    navigate("/admin/orders");
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
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  {orderCount > 0 && (
                    <IconBadge>{orderCount > 9 ? "9+" : orderCount}</IconBadge>
                  )}
                </IconBtn>
              </>
            )}

            {/* USER */}
            {auth._id ? (
              <UserMenu ref={userRef}>
                <UserBtn onClick={() => setShowUserMenu((v) => !v)}>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <UserInfo>
                    <UserGreet>Tài khoản</UserGreet>
                    <UserName>{auth.name || "User"}</UserName>
                  </UserInfo>
                  <ChevronSVG
                    $open={showUserMenu}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </ChevronSVG>
                </UserBtn>
                {showUserMenu && (
                  <UserDropdown>
                    {auth.isAdmin && (
                      <DropItem
                        as={Link}
                        to="/admin/summary"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" />
                        </svg>
                        Quản trị
                      </DropItem>
                    )}
                    {!auth.isAdmin && (
                      <DropItem
                        as={Link}
                        to="/my-orders"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                          <rect x="9" y="3" width="6" height="4" rx="1" />
                        </svg>
                        Đơn hàng của tôi
                      </DropItem>
                    )}
                    <DropDivider />
                    {/* ← MERGE từ file bạn: lưu cart + resetCart khi logout */}
                    <DropItem
                      $danger
                      onClick={() => {
                        localStorage.setItem(
                          `cart_${auth._id}`,
                          JSON.stringify(cartItems),
                        );
                        dispatch(resetCart());
                        dispatch(logoutUser());
                        setShowUserMenu(false);
                        toast.warning("Đã đăng xuất!", {
                          position: "bottom-left",
                        });
                        navigate("/");
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Đăng xuất
                    </DropItem>
                  </UserDropdown>
                )}
              </UserMenu>
            ) : (
              <AuthBlock>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <AuthLinks>
                  <AuthLink as={Link} to="/login">
                    Đăng nhập
                  </AuthLink>
                  <AuthSub as={Link} to="/register">
                    Đăng ký
                  </AuthSub>
                </AuthLinks>
              </AuthBlock>
            )}

            {/* CART */}
            <CartLink to="/cart">
              <CartIconWrap>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {cartTotalQuantity > 0 && (
                  <CartBadge>{cartTotalQuantity}</CartBadge>
                )}
              </CartIconWrap>
              <CartLabel>
                <CartSub>Giỏ hàng</CartSub>
                <CartCount>{cartTotalQuantity} sản phẩm</CartCount>
              </CartLabel>
            </CartLink>
          </RightActions>
        </MainInner>
      </MainNav>

      {/* ════════ BOTTOM NAV ════════ */}
      <BottomNav>
        <BottomInner>
          <CatWrapper ref={catRef}>
            <CatBtn
              onClick={() => setShowCategories((v) => !v)}
              $active={showCategories}
            >
              <HamburgerIcon $active={showCategories}>
                <span />
                <span />
                <span />
              </HamburgerIcon>
              DANH MỤC SẢN PHẨM
              <ChevronSVG
                $open={showCategories}
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{ width: 16, height: 16 }}
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </ChevronSVG>
            </CatBtn>
            {showCategories && (
              <CatDropdown>
                {CATEGORIES.map((cat) => (
                  <CatItem
                    key={cat.key}
                    onClick={() => handleCategory(cat.key)}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                    {cat.label}
                    <CatArrow viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </CatArrow>
                  </CatItem>
                ))}
              </CatDropdown>
            )}
          </CatWrapper>

          <NavLinks>
            {NAV_LINKS.map((link) => (
              <NavLinkItem key={link.label} to={link.to}>
                {link.label}
                {link.label === "Bộ sưu tập" && <NewBadge>MỚI</NewBadge>}
              </NavLinkItem>
            ))}
          </NavLinks>
        </BottomInner>
      </BottomNav>
    </HeaderRoot>
  );
};

export default NavBar;

/* ═══════════════════════════════════════
   STYLED COMPONENTS (giữ nguyên từ file bạn bè)
═══════════════════════════════════════ */
const HeaderRoot = styled.header`
  position: sticky;
  top: 0;
  z-index: 200;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
`;
const TopBar = styled.div`
  background: #0f172a;
  height: 36px;
  display: flex;
  align-items: center;
`;
const TopInner = styled.div`
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const TopLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
const TopItem = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #94a3b8;
  strong {
    color: #e2e8f0;
    font-weight: 600;
  }
`;
const TopDivider = styled.span`
  width: 1px;
  height: 14px;
  background: #334155;
`;
const TopRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;
const TopLink = styled.span`
  font-size: 12px;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.15s;
  &:hover {
    color: #e2e8f0;
  }
`;
const MainNav = styled.div`
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
`;
const MainInner = styled.div`
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 72px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;
const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const LogoIcon = styled.svg`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
`;
const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;
const LogoName = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 0.06em;
  line-height: 1.1;
`;
const LogoSub = styled.span`
  font-size: 10px;
  color: #64748b;
  letter-spacing: 0.03em;
  text-transform: uppercase;
`;
const SearchWrap = styled.form`
  flex: 1;
  max-width: 560px;
`;
const SearchInner = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.15s;
  &:focus-within {
    border-color: #1d4ed8;
  }
`;
const SearchInput = styled.input`
  flex: 1;
  height: 42px;
  padding: 0 14px;
  border: none;
  outline: none;
  font-size: 14px;
  color: #1e293b;
  background: transparent;
  &::placeholder {
    color: #94a3b8;
  }
`;
const SearchBtn = styled.button`
  width: 52px;
  height: 42px;
  background: #1d4ed8;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: background 0.15s;
  flex-shrink: 0;
  &:hover {
    background: #1e40af;
  }
`;
const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  flex-shrink: 0;
`;

/* ← MERGE từ file bạn: IconBtn + IconBadge */
const IconBtn = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
  &:hover {
    background: #f1f5f9;
    color: #1e293b;
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
  border: 1.5px solid white;
`;

const UserMenu = styled.div`
  position: relative;
`;
const UserBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #1e293b;
  padding: 6px 8px;
  border-radius: 8px;
  transition: background 0.15s;
  &:hover {
    background: #f1f5f9;
  }
`;
const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;
const UserGreet = styled.span`
  font-size: 11px;
  color: #64748b;
`;
const UserName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const ChevronSVG = styled.svg`
  width: 16px;
  height: 16px;
  color: #64748b;
  transition: transform 0.2s;
  transform: ${(p) => (p.$open ? "rotate(180deg)" : "rotate(0)")};
`;
const UserDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 200px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 300;
`;
const DropItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  font-size: 14px;
  color: ${(p) => (p.$danger ? "#dc2626" : "#374151")};
  cursor: pointer;
  text-decoration: none;
  transition: background 0.12s;
  &:hover {
    background: ${(p) => (p.$danger ? "#fef2f2" : "#f8fafc")};
  }
`;
const DropDivider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 4px 0;
`;
const AuthBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
`;

const AuthLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AuthLink = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #1d4ed8;
  }
`;

const AuthSub = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #1d4ed8;
  }
`;

const CartLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #1e293b;
  padding: 6px 10px;
  border-radius: 8px;
  transition: background 0.15s;
  &:hover {
    background: #f1f5f9;
  }
`;
const CartIconWrap = styled.div`
  position: relative;
`;
const CartBadge = styled.span`
  position: absolute;
  top: -7px;
  right: -7px;
  background: #1d4ed8;
  color: white;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
`;
const CartLabel = styled.div`
  display: flex;
  flex-direction: column;
`;
const CartSub = styled.span`
  font-size: 11px;
  color: #64748b;
`;
const CartCount = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
`;
const BottomNav = styled.div`
  background: #1d4ed8;
`;
const BottomInner = styled.div`
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: stretch;
  height: 44px;
`;
const CatWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;
const CatBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 16px;
  background: ${(p) => (p.$active ? "#1e40af" : "rgba(255,255,255,0.15)")};
  border: none;
  color: white;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
  &:hover {
    background: #1e40af;
  }
`;
const HamburgerIcon = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 16px;
  span {
    display: block;
    height: 2px;
    background: white;
    border-radius: 2px;
    transition: all 0.2s;
    &:nth-child(2) {
      width: ${(p) => (p.$active ? "0" : "75%")};
    }
    &:nth-child(1),
    &:nth-child(3) {
      width: 100%;
    }
  }
`;
const CatDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 260px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 300;
  overflow: hidden;
`;
const CatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  font-size: 13.5px;
  color: #374151;
  cursor: pointer;
  transition:
    background 0.12s,
    color 0.12s;
  &:hover {
    background: #eff6ff;
    color: #1d4ed8;
  }
`;
const CatArrow = styled.svg`
  width: 14px;
  height: 14px;
  margin-left: auto;
  color: #cbd5e1;
  flex-shrink: 0;
`;
const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  padding-left: 8px;
`;
const NavLinkItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 5px;
  height: 44px;
  padding: 0 14px;
  font-size: 13.5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition:
    background 0.15s,
    color 0.15s;
  white-space: nowrap;
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: white;
  }
`;
const NewBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  background: #ef4444;
  color: white;
  padding: 1px 5px;
  border-radius: 4px;
  letter-spacing: 0.05em;
`;
