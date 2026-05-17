import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, getTotals } from "../../../features/cart/CartSlice";
import styled, { keyframes } from "styled-components";

/* ── Đặt thời điểm kết thúc flash sale (thay đổi tuỳ ý) ── */
const SALE_END = new Date();
SALE_END.setHours(SALE_END.getHours() + 2);
SALE_END.setMinutes(SALE_END.getMinutes() + 30);

const TABS = [
  { label: "Tất cả", key: "" },
  { label: "GPU", key: "GPU" },
  { label: "CPU", key: "CPU" },
  { label: "RAM", key: "RAM" },
  { label: "Màn hình", key: "Monitor" },
];

const FlashSale = ({ products = [] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("");
  const [timeLeft, setTimeLeft] = useState(calcTime());

  function calcTime() {
    const diff = SALE_END - new Date();
    if (diff <= 0) return { h: "00", m: "00", s: "00" };
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return {
      h: String(h).padStart(2, "0"),
      m: String(m).padStart(2, "0"),
      s: String(s).padStart(2, "0"),
    };
  }

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(calcTime()), 1000);
    return () => clearInterval(t);
  }, []);

  /* Lọc sản phẩm: chỉ lấy sản phẩm đang giảm giá */
  const saleProducts = products.filter(
    (p) => p.isDiscount && p.discountPercent > 0,
  );

  const filtered =
    activeTab === ""
      ? saleProducts
      : saleProducts.filter((p) => p.category === activeTab);

  if (saleProducts.length === 0) return null;

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addToCart(product));
    dispatch(getTotals());
  };

  return (
    <Wrapper>
      {/* ── HEADER ── */}
      <Header>
        <HeaderLeft>
          <FlashIcon>⚡</FlashIcon>
          <TitleText>FLASH SALE</TitleText>

          {/* COUNTDOWN */}
          <Countdown>
            <TimeBlock>
              <TimeNum>{timeLeft.h}</TimeNum>
              <TimeLabel>Giờ</TimeLabel>
            </TimeBlock>
            <TimeSep>:</TimeSep>
            <TimeBlock>
              <TimeNum>{timeLeft.m}</TimeNum>
              <TimeLabel>Phút</TimeLabel>
            </TimeBlock>
            <TimeSep>:</TimeSep>
            <TimeBlock>
              <TimeNum>{timeLeft.s}</TimeNum>
              <TimeLabel>Giây</TimeLabel>
            </TimeBlock>
          </Countdown>

          <SaleDesc>
            ⚡ DEAL KHỦNG – GIẢM ĐẾN{" "}
            {Math.max(...saleProducts.map((p) => p.discountPercent))}%
          </SaleDesc>
        </HeaderLeft>

        <SeeAllBtn
          onClick={() => {
            navigate("/category/sale");
            window.scrollTo(0, 0);
          }}
        >
          Xem tất cả &rarr;
        </SeeAllBtn>
      </Header>

      {/* ── TABS ── */}
      <Tabs>
        {TABS.map((tab) => (
          <Tab
            key={tab.key}
            $active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Tab>
        ))}
      </Tabs>

      {/* ── PRODUCT SCROLL ── */}
      <ScrollTrack>
        {filtered.length === 0 ? (
          <EmptyTab>Không có sản phẩm trong danh mục này</EmptyTab>
        ) : (
          filtered.map((product) => {
            const salePrice = (
              product.price *
              (1 - product.discountPercent / 100)
            ).toLocaleString("vi-VN");
            return (
              <Card
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {/* Flash Sale Banner */}
                <CardBanner>
                  <BannerText>⚡ FLASH SALE ⚡</BannerText>
                </CardBanner>

                <CardImg src={product.image} alt={product.name} />

                <CardBody>
                  <CardName>{product.name}</CardName>

                  <PriceRow>
                    <SalePrice>{salePrice}₫</SalePrice>
                    <BadgeRow>
                      <OldPrice>
                        {product.price?.toLocaleString("vi-VN")}₫
                      </OldPrice>
                      <DiscBadge>-{product.discountPercent}%</DiscBadge>
                    </BadgeRow>
                    <SaveText>
                      Tiết kiệm{" "}
                      {(
                        product.price *
                        (product.discountPercent / 100)
                      ).toLocaleString("vi-VN")}
                      ₫
                    </SaveText>
                  </PriceRow>

                  {/* Progress bar giả lập độ hot */}
                  <ProgressWrap>
                    <ProgressBar
                      $pct={Math.min(30 + product.discountPercent * 1.5, 90)}
                    />
                    <ProgressLabel>
                      {product.quantity <= 3 ? "🔥 Sắp hết" : "🔥 Đang bán"}
                    </ProgressLabel>
                  </ProgressWrap>

                  <CardBtn
                    disabled={product.quantity === 0}
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    {product.quantity === 0 ? "Hết hàng" : "Mua ngay"}
                  </CardBtn>
                </CardBody>
              </Card>
            );
          })
        )}
      </ScrollTrack>
    </Wrapper>
  );
};

export default FlashSale;

/* ═══════════════════════════════════════
   STYLED COMPONENTS
═══════════════════════════════════════ */

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const Wrapper = styled.section`
  background: linear-gradient(135deg, #1658a3 0%, #152580 100%);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2rem;
`;

/* Header */
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  flex-wrap: wrap;
  gap: 10px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const FlashIcon = styled.span`
  font-size: 24px;
  animation: ${pulse} 1s infinite;
`;

const TitleText = styled.h2`
  font-size: 22px;
  font-weight: 900;
  color: #fbbf24;
  letter-spacing: 0.05em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
`;

/* Countdown */
const Countdown = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.25);
  padding: 4px 10px;
  border-radius: 8px;
`;

const TimeBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 32px;
`;

const TimeNum = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: white;
  line-height: 1;
  font-variant-numeric: tabular-nums;
`;

const TimeLabel = styled.span`
  font-size: 9px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TimeSep = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: #fbbf24;
  line-height: 1;
  margin-bottom: 8px;
  animation: ${pulse} 1s infinite;
`;

const SaleDesc = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #fef08a;
  letter-spacing: 0.03em;
  white-space: nowrap;
`;

const SeeAllBtn = styled.button`
  height: 36px;
  padding: 0 18px;
  background: #fbbf24;
  color: #14532d;
  font-size: 13px;
  font-weight: 700;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 0.15s,
    transform 0.15s;
  &:hover {
    background: #fde68a;
    transform: translateY(-1px);
  }
`;

/* Tabs */
const Tabs = styled.div`
  display: flex;
  gap: 8px;
  padding: 0 20px 12px;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button`
  height: 32px;
  padding: 0 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  border: 2px solid ${(p) => (p.$active ? "#fbbf24" : "rgba(255,255,255,0.3)")};
  background: ${(p) => (p.$active ? "#fbbf24" : "transparent")};
  color: ${(p) => (p.$active ? "#14532d" : "white")};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
  &:hover {
    background: ${(p) => (p.$active ? "#fde68a" : "rgba(255,255,255,0.15)")};
  }
`;

/* Scroll */
const ScrollTrack = styled.div`
  display: flex;
  gap: 12px;
  padding: 0 20px 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
`;

const EmptyTab = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  padding: 2rem 0;
`;

/* Card */
const Card = styled.div`
  flex-shrink: 0;
  width: 190px;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  scroll-snap-align: start;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

const CardBanner = styled.div`
  background: linear-gradient(90deg, #dc2626, #b91c1c);
  padding: 4px 0;
  text-align: center;
`;

const BannerText = styled.span`
  font-size: 10px;
  font-weight: 800;
  color: #fbbf24;
  letter-spacing: 0.1em;
`;

const CardImg = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
`;

const CardBody = styled.div`
  padding: 10px;
`;

const CardName = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 6px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 34px;
`;

const PriceRow = styled.div`
  margin-bottom: 6px;
`;

const SalePrice = styled.p`
  font-size: 15px;
  font-weight: 800;
  color: #dc2626;
  margin: 0;
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 2px;
`;

const OldPrice = styled.span`
  font-size: 11px;
  color: #94a3b8;
  text-decoration: line-through;
`;

const DiscBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: white;
  background: #dc2626;
  padding: 1px 5px;
  border-radius: 4px;
`;

/* Progress */
const ProgressWrap = styled.div`
  margin-bottom: 8px;
`;

const ProgressBar = styled.div`
  height: 6px;
  background: #fee2e2;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 3px;
  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${(p) => p.$pct}%;
    background: linear-gradient(90deg, #f97316, #dc2626);
    border-radius: 3px;
  }
`;

const ProgressLabel = styled.span`
  font-size: 10px;
  color: #dc2626;
  font-weight: 600;
`;

const CardBtn = styled.button`
  width: 100%;
  height: 32px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  border: none;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  background: ${(p) =>
    p.disabled ? "#e2e8f0" : "linear-gradient(90deg, #dc2626, #b91c1c)"};
  color: ${(p) => (p.disabled ? "#94a3b8" : "white")};
  transition: opacity 0.15s;
  &:hover:not(:disabled) {
    opacity: 0.88;
  }
`;
const SaveText = styled.span`
  display: block;
  font-size: 10px;
  font-weight: 600;
  color: #16a34a;
  margin-top: 2px;
`;
