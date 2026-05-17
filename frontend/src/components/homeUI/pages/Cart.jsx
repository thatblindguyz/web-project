import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  addToCart,
  clearCart,
  decreaseCart,
  removeFromCart,
  getTotals,
} from "../../../features/cart/CartSlice";
import { useEffect } from "react";
import PayButton from "../payment/PayButton";
import styled, { keyframes } from "styled-components";

const Cart = () => {
  const { cartItems, cartTotalAmount } = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(getTotals());
  }, [cartItems, dispatch]);

  const handleRemoveFromCart = (cartItem) =>
    dispatch(removeFromCart({ ...cartItem, userId: auth._id }));

  const handleDecreaseCart = (cartItem) =>
    dispatch(decreaseCart({ ...cartItem, userId: auth._id }));

  const handleIncreaseCart = (cartItem) =>
    dispatch(addToCart({ ...cartItem, userId: auth._id }));

  const handleClearCart = () => dispatch(clearCart({ userId: auth._id }));

  const getPrice = (item) =>
    item.isDiscount && item.discountPercent > 0
      ? item.price * (1 - item.discountPercent / 100)
      : item.price;

  const totalItems = cartItems.reduce((s, i) => s + i.cartQuantity, 0);

  return (
    <Wrapper>
      {/* ── Page header ── */}
      <PageHeader>
        <HeaderInner>
          <BackLink to="/">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Tiếp tục mua hàng
          </BackLink>
          <PageTitle>
            <CartIconWrap>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </CartIconWrap>
            Giỏ Hàng
            {cartItems.length > 0 && <ItemBadge>{totalItems}</ItemBadge>}
          </PageTitle>
        </HeaderInner>
      </PageHeader>

      <ContentInner>
        {/* ══ EMPTY STATE ══ */}
        {cartItems.length === 0 && (
          <EmptyWrap>
            <EmptyIcon>
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </EmptyIcon>
            <EmptyTitle>Giỏ hàng trống</EmptyTitle>
            <EmptyDesc>Bạn chưa có sản phẩm nào trong giỏ hàng.</EmptyDesc>
            <ShopBtn to="/">Khám phá sản phẩm</ShopBtn>
          </EmptyWrap>
        )}

        {/* ══ CART CONTENT ══ */}
        {cartItems.length > 0 && (
          <TwoCol>
            {/* Left – item list */}
            <ItemsCol>
              <ColHeader>
                <ColTitle>Sản phẩm ({totalItems})</ColTitle>
                <ClearBtn onClick={handleClearCart}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                  Xóa tất cả
                </ClearBtn>
              </ColHeader>

              <ItemList>
                {cartItems.map((item) => (
                  <CartItem key={item._id}>
                    <ItemImg src={item.image} alt={item.name} />
                    <ItemMeta>
                      <ItemCategory>
                        {item.shortDesc || "Linh kiện"}
                      </ItemCategory>
                      <ItemName>{item.name}</ItemName>
                      <PriceRow>
                        <ItemPrice>
                          {getPrice(item).toLocaleString("vi-VN")}₫
                        </ItemPrice>
                        {item.isDiscount && item.discountPercent > 0 && (
                          <>
                            <ItemOldPrice>
                              {item.price.toLocaleString("vi-VN")}₫
                            </ItemOldPrice>
                            <DiscTag>-{item.discountPercent}%</DiscTag>
                          </>
                        )}
                      </PriceRow>
                      <ItemActions>
                        <QtyControl>
                          <QtyBtn onClick={() => handleDecreaseCart(item)}>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </QtyBtn>
                          <QtyNum>{item.cartQuantity}</QtyNum>
                          <QtyBtn onClick={() => handleIncreaseCart(item)}>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </QtyBtn>
                        </QtyControl>
                        <RemoveBtn onClick={() => handleRemoveFromCart(item)}>
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                          Xóa
                        </RemoveBtn>
                      </ItemActions>
                    </ItemMeta>
                    <ItemLineTotal>
                      {(getPrice(item) * item.cartQuantity).toLocaleString(
                        "vi-VN",
                      )}
                      ₫
                    </ItemLineTotal>
                  </CartItem>
                ))}
              </ItemList>
            </ItemsCol>

            {/* Right – summary */}
            <SummaryCol>
              <SummaryCard>
                <SummaryTitle>Tóm tắt đơn hàng</SummaryTitle>

                <SummaryRows>
                  <SummaryRow>
                    <span>Tạm tính ({totalItems} sản phẩm)</span>
                    <span>{cartTotalAmount.toLocaleString("vi-VN")}₫</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span>Phí vận chuyển</span>
                    <FreeTag>Tính khi thanh toán</FreeTag>
                  </SummaryRow>
                  <SummaryRow>
                    <span>Thuế (VAT)</span>
                    <FreeTag>Tính khi thanh toán</FreeTag>
                  </SummaryRow>
                </SummaryRows>

                <Divider />

                <TotalRow>
                  <TotalLabel>Tổng cộng</TotalLabel>
                  <TotalAmount>
                    {cartTotalAmount.toLocaleString("vi-VN")}₫
                  </TotalAmount>
                </TotalRow>

                <TaxNote>
                  Thuế và phí vận chuyển được tính tại thời điểm thanh toán
                </TaxNote>

                {auth._id ? (
                  <CheckoutWrap>
                    <PayButton cartItems={cartItems} />
                  </CheckoutWrap>
                ) : (
                  <LoginBtn onClick={() => navigate("/login")}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Đăng nhập để thanh toán
                  </LoginBtn>
                )}

                {/* Trust badges */}
                <TrustList>
                  {[
                    { icon: "🛡️", text: "Thanh toán bảo mật 100%" },
                    { icon: "↩️", text: "Đổi trả trong 7 ngày" },
                    { icon: "🚚", text: "Giao hàng toàn quốc" },
                  ].map((t) => (
                    <TrustRow key={t.text}>
                      <span>{t.icon}</span>
                      <span>{t.text}</span>
                    </TrustRow>
                  ))}
                </TrustList>
              </SummaryCard>
            </SummaryCol>
          </TwoCol>
        )}
      </ContentInner>
    </Wrapper>
  );
};

export default Cart;

/* ═══════════════════════════════════
   STYLED COMPONENTS
═══════════════════════════════════ */

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div`
  background: #f1f5f9;
  min-height: 100vh;
`;

/* ── Header bar ── */
const PageHeader = styled.div`
  background: white;
  border-bottom: 1px solid #e2e8f0;
`;
const HeaderInner = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  text-decoration: none;
  transition: color 0.15s;
  &:hover {
    color: #1d4ed8;
  }
`;
const PageTitle = styled.h1`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;
const CartIconWrap = styled.div`
  color: #1d4ed8;
  display: flex;
`;
const ItemBadge = styled.span`
  background: #1d4ed8;
  color: white;
  font-size: 11px;
  font-weight: 700;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* ── Layout ── */
const ContentInner = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  animation: ${fadeUp} 0.4s ease both;
`;
const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.5rem;
  align-items: start;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

/* ── Empty state ── */
const EmptyWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  gap: 14px;
`;
const EmptyIcon = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  margin-bottom: 8px;
`;
const EmptyTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;
const EmptyDesc = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;
`;
const ShopBtn = styled(Link)`
  display: inline-block;
  margin-top: 8px;
  height: 44px;
  padding: 0 28px;
  line-height: 44px;
  background: #1d4ed8;
  color: white;
  font-size: 14px;
  font-weight: 700;
  border-radius: 8px;
  text-decoration: none;
  transition:
    background 0.15s,
    transform 0.15s;
  &:hover {
    background: #1e40af;
    transform: translateY(-1px);
  }
`;

/* ── Items column ── */
const ItemsCol = styled.div``;
const ColHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;
const ColTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  padding-left: 12px;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 18px;
    background: #1d4ed8;
    border-radius: 2px;
  }
`;
const ClearBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 5px 10px;
  cursor: pointer;
  transition:
    color 0.15s,
    border-color 0.15s;
  &:hover {
    color: #dc2626;
    border-color: #fca5a5;
  }
`;
const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const CartItem = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px;
  display: grid;
  grid-template-columns: 90px 1fr auto;
  gap: 14px;
  align-items: center;
  transition: box-shadow 0.15s;
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
  }
`;
const ItemImg = styled.img`
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
`;
const ItemMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;
const ItemCategory = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;
const ItemName = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 2px;
`;
const ItemPrice = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #1d4ed8;
`;
const ItemOldPrice = styled.span`
  font-size: 11px;
  color: #94a3b8;
  text-decoration: line-through;
`;
const DiscTag = styled.span`
  font-size: 10px;
  font-weight: 700;
  background: #fef2f2;
  color: #dc2626;
  padding: 1px 5px;
  border-radius: 4px;
`;
const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
`;
const QtyControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  overflow: hidden;
`;
const QtyBtn = styled.button`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: none;
  cursor: pointer;
  color: #475569;
  transition:
    background 0.12s,
    color 0.12s;
  &:hover {
    background: #1d4ed8;
    color: white;
  }
`;
const QtyNum = styled.div`
  width: 34px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  border-left: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  line-height: 30px;
`;
const RemoveBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
  &:hover {
    color: #dc2626;
  }
`;
const ItemLineTotal = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
  align-self: center;
`;

/* ── Summary column ── */
const SummaryCol = styled.div`
  position: sticky;
  top: 80px;
`;
const SummaryCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
`;
const SummaryTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px;
  padding-left: 12px;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 18px;
    background: #1d4ed8;
    border-radius: 2px;
  }
`;
const SummaryRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #475569;
`;
const FreeTag = styled.span`
  font-size: 11px;
  color: #64748b;
  font-style: italic;
`;
const Divider = styled.div`
  height: 1px;
  background: #f1f5f9;
  margin: 14px 0;
`;
const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;
const TotalLabel = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
`;
const TotalAmount = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: #1d4ed8;
`;
const TaxNote = styled.p`
  font-size: 11px;
  color: #94a3b8;
  margin: 0 0 16px;
  line-height: 1.5;
`;
const CheckoutWrap = styled.div`
  /* PayButton will fill this */
  button,
  a {
    width: 100%;
    height: 46px;
    background: #1d4ed8;
    color: white;
    font-size: 15px;
    font-weight: 700;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition:
      background 0.15s,
      transform 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    &:hover {
      background: #1e40af;
      transform: translateY(-1px);
    }
  }
`;
const LoginBtn = styled.button`
  width: 100%;
  height: 46px;
  background: #1d4ed8;
  color: white;
  font-size: 14px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition:
    background 0.15s,
    transform 0.15s;
  &:hover {
    background: #1e40af;
    transform: translateY(-1px);
  }
`;
const TrustList = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid #f1f5f9;
  padding-top: 14px;
`;
const TrustRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
`;
