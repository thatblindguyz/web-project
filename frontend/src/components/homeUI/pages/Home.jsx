import { useGetProductsQuery } from "../../../features/product/ProductAPI";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getTotals } from "../../../features/cart/CartSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";

const Home = () => {
  const { data, error, isLoading } = useGetProductsQuery();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const auth = useSelector((state) => state.auth);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setShowBanner(true);
  }, []);

  const filteredProducts = data?.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, userId: auth._id }));
    dispatch(getTotals());
  };

  return (
    <>
      {/* banner */}
      {showBanner && (
        <BannerOverlay>
          <BannerBox>
            <CloseBtn onClick={() => setShowBanner(false)}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </CloseBtn>

            <BannerImageWrap>
              <BannerImage
                src="https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80"
                alt="PC components"
              />
              <BannerImageOverlay />
              <BannerTag>Flash Sale</BannerTag>
            </BannerImageWrap>

            <BannerContent>
              <BannerTitle>Linh kiện máy tính</BannerTitle>
              <BannerText>
                Giảm đến <strong>30%</strong> cho CPU, RAM, VGA và ổ cứng. Số
                lượng có hạn — ưu tiên đặt trước.
              </BannerText>

              <StatsRow>
                <StatCard>
                  <StatNum>30%</StatNum>
                  <StatLabel>Giảm tối đa</StatLabel>
                </StatCard>
                <StatCard>
                  <StatNum>50+</StatNum>
                  <StatLabel>Sản phẩm</StatLabel>
                </StatCard>
                <StatCard>
                  <StatNum>24h</StatNum>
                  <StatLabel>Còn lại</StatLabel>
                </StatCard>
              </StatsRow>

              <BannerButton onClick={() => setShowBanner(false)}>
                Mua ngay
              </BannerButton>
            </BannerContent>
          </BannerBox>
        </BannerOverlay>
      )}

      <Wrapper>
        {isLoading ? (
          <StatusText>Loading...</StatusText>
        ) : error ? (
          <StatusText>Error loading products.</StatusText>
        ) : (
          <>
            <PageTitle>New Arrival</PageTitle>

            <ProductGrid>
              {filteredProducts?.map((product) => (
                <ProductCard
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <ProductImg src={product.image} alt={product.name} />
                  <ProductTitle>{product.name}</ProductTitle>
                  <PriceBlock>
                    {product.isDiscount && product.discountPercent > 0 ? (
                      <>
                        <NewPrice>
                          $
                          {(
                            product.price *
                            (1 - product.discountPercent / 100)
                          ).toLocaleString("vi-VN")}
                          ₫
                        </NewPrice>
                        <OldPriceRow>
                          <OldPrice>
                            {product.price?.toLocaleString("vi-VN")}₫
                          </OldPrice>
                          <DiscountBadge>
                            -{product.discountPercent}%
                          </DiscountBadge>
                        </OldPriceRow>
                      </>
                    ) : (
                      <Price>{product.price?.toLocaleString("vi-VN")}₫</Price>
                    )}
                  </PriceBlock>
                  <Stock
                    $out={product.quantity === 0}
                    $low={product.quantity <= 3 && product.quantity > 0}
                  >
                    {product.quantity === 0
                      ? "Out of Stock"
                      : `Stock: ${product.quantity}`}
                  </Stock>
                  <AddButton
                    disabled={product.quantity === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                  </AddButton>
                </ProductCard>
              ))}
            </ProductGrid>
          </>
        )}
      </Wrapper>
    </>
  );
};

export default Home;

/* ================= STYLES ================= */

const Wrapper = styled.div`
  padding: 2rem 3rem;
  background: #f8fafc;
  min-height: 100vh;
`;

const StatusText = styled.p`
  font-size: 15px;
  color: #64748b;
  padding: 2rem 0;
`;

const PageTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
`;

const ProductCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: box-shadow 0.15s;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const ProductImg = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const ProductTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 8px 0 4px;
  min-height: 80px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Price = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: #1d4ed8;
  margin: 0 0 4px;
`;

const Stock = styled.p`
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 10px;
  color: ${(p) => (p.$out ? "#dc2626" : p.$low ? "#d97706" : "#16a34a")};
`;

const AddButton = styled.button`
  width: 100%;
  height: 36px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  transition: opacity 0.15s;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  background: ${(p) => (p.disabled ? "#e2e8f0" : "#1d4ed8")};
  color: ${(p) => (p.disabled ? "#94a3b8" : "#ffffff")};

  &:hover:not(:disabled) {
    opacity: 0.88;
  }
`;

const PriceBlock = styled.div`
  margin: 0 0 4px;
  min-height: 44px;
`;

const NewPrice = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: #1d4ed8;
  margin: 0;
`;

const OldPriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const OldPrice = styled.p`
  font-size: 13px;
  color: #94a3b8;
  text-decoration: line-through;
  margin: 0;
`;

const DiscountBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #dc2626;
  background: #fef2f2;
  border-radius: 4px;
  padding: 1px 5px;
`;

const BannerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 1rem;
`;

const BannerBox = styled.div`
  width: 92%;
  max-width: 460px;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  position: relative;
  animation: popup 0.25s ease;

  @keyframes popup {
    from {
      opacity: 0;
      transform: scale(0.92);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.25);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: background 0.15s;

  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }
`;

const BannerImageWrap = styled.div`
  position: relative;
  height: 200px;
  background: #0f172a;
  overflow: hidden;
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
`;

const BannerImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, #0f172a 100%);
`;

const BannerTag = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  background: #1d4ed8;
  color: #bfdbfe;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 6px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const BannerContent = styled.div`
  padding: 1.25rem 1.5rem 1.5rem;
`;

const BannerTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px;
`;

const BannerText = styled.p`
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin: 0 0 16px;

  strong {
    color: #0f172a;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
`;

const StatCard = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 10px 12px;
  text-align: center;
  border: 1px solid #f1f5f9;
`;

const StatNum = styled.p`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

const StatLabel = styled.p`
  font-size: 11px;
  color: #64748b;
  margin: 2px 0 0;
`;

const BannerButton = styled.button`
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 8px;
  background: #1e293b;
  color: #f8fafc;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.88;
  }
`;
