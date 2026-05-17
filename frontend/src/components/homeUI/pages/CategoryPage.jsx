import { useGetProductsQuery } from "../../../features/product/ProductAPI";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getTotals } from "../../../features/cart/CartSlice";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";

const CATEGORY_LABELS = {
  GPU: "Card màn hình (GPU)",
  CPU: "Bộ vi xử lý (CPU)",
  RAM: "Bộ nhớ trong (RAM)",
  Monitor: "Màn hình máy tính",
  sale: "⚡ Sản phẩm Flash Sale",
};

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
  { value: "name_asc", label: "Tên A → Z" },
];

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { data, isLoading, error } = useGetProductsQuery();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sort, setSort] = useState("newest");
  const [onlyInStock, setOnlyInStock] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryName]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, userId: auth._id }));
    dispatch(getTotals());
  };

  const products = useMemo(() => {
    if (!data) return [];

    let result =
      categoryName === "sale"
        ? data.filter((p) => p.isDiscount && p.discountPercent > 0)
        : data.filter(
            (p) => p.category?.toLowerCase() === categoryName?.toLowerCase(),
          );

    if (onlyInStock) result = result.filter((p) => p.quantity > 0);

    switch (sort) {
      case "price_asc":
        return [...result].sort((a, b) => a.price - b.price);
      case "price_desc":
        return [...result].sort((a, b) => b.price - a.price);
      case "name_asc":
        return [...result].sort((a, b) => a.name.localeCompare(b.name));
      case "newest":
      default:
        return [...result].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
    }
  }, [data, categoryName, sort, onlyInStock]);

  const label = CATEGORY_LABELS[categoryName] || categoryName;

  return (
    <Wrapper>
      {/* ── HEADER ── */}
      <PageHeader>
        <HeaderInner>
          <BackBtn
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
            }}
          >
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
            Trang chủ
          </BackBtn>
          <PageTitle>{label}</PageTitle>
          <ProductCount>{products.length} sản phẩm</ProductCount>
        </HeaderInner>
      </PageHeader>

      <ContentInner>
        {/* ── FILTER BAR ── */}
        <FilterBar>
          <FilterLeft>
            <FilterLabel>Sắp xếp:</FilterLabel>
            {SORT_OPTIONS.map((opt) => (
              <SortBtn
                key={opt.value}
                $active={sort === opt.value}
                onClick={() => setSort(opt.value)}
              >
                {opt.label}
              </SortBtn>
            ))}
          </FilterLeft>

          <FilterRight>
            <StockToggle
              $active={onlyInStock}
              onClick={() => setOnlyInStock((v) => !v)}
            >
              <ToggleDot $active={onlyInStock} />
              Chỉ còn hàng
            </StockToggle>
          </FilterRight>
        </FilterBar>

        {/* ── PRODUCTS ── */}
        {isLoading ? (
          <StatusText>Đang tải sản phẩm...</StatusText>
        ) : error ? (
          <StatusText>Lỗi tải sản phẩm.</StatusText>
        ) : products.length === 0 ? (
          <EmptyState>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <EmptyText>Không có sản phẩm nào</EmptyText>
          </EmptyState>
        ) : (
          <ProductGrid>
            {products.map((product) => (
              <ProductCard
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {product.quantity === 0 && <OutBadge>Hết hàng</OutBadge>}

                <ProductImg src={product.image} alt={product.name} />

                <ProductBody>
                  <ProductCat>{product.shortDesc || categoryName}</ProductCat>
                  <ProductTitle>{product.name}</ProductTitle>

                  <PriceBlock>
                    {product.isDiscount && product.discountPercent > 0 ? (
                      <>
                        <PriceTopRow>
                          <SalePrice>
                            {(
                              product.price *
                              (1 - product.discountPercent / 100)
                            ).toLocaleString("vi-VN")}
                            ₫
                          </SalePrice>
                          <DiscountInlineBadge>
                            -{product.discountPercent}%
                          </DiscountInlineBadge>
                        </PriceTopRow>
                        <PriceRowBottom>
                          <OldPrice>
                            {product.price?.toLocaleString("vi-VN")}₫
                          </OldPrice>
                          <SaveBadge>
                            Tiết kiệm{" "}
                            {(
                              product.price *
                              (product.discountPercent / 100)
                            ).toLocaleString("vi-VN")}
                            ₫
                          </SaveBadge>
                        </PriceRowBottom>
                      </>
                    ) : (
                      <NewPrice>
                        {product.price?.toLocaleString("vi-VN")}₫
                      </NewPrice>
                    )}
                  </PriceBlock>

                  <StockRow
                    $out={product.quantity === 0}
                    $low={product.quantity <= 3 && product.quantity > 0}
                  >
                    <StockDot />
                    {product.quantity === 0
                      ? "Hết hàng"
                      : product.quantity <= 3
                        ? "Sắp hết hàng"
                        : "Còn hàng"}
                  </StockRow>

                  <AddButton
                    disabled={product.quantity === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    {product.quantity === 0 ? "Hết hàng" : "Thêm vào giỏ"}
                  </AddButton>
                </ProductBody>
              </ProductCard>
            ))}
          </ProductGrid>
        )}
      </ContentInner>
    </Wrapper>
  );
};

export default CategoryPage;

/* ═══════════════════════════════════════
   STYLED COMPONENTS
═══════════════════════════════════════ */
const Wrapper = styled.div`
  background: #f1f5f9;
  min-height: 100vh;
`;
const PageHeader = styled.div`
  background: white;
  border-bottom: 1px solid #e2e8f0;
`;
const HeaderInner = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 16px;
`;
const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
  &:hover {
    color: #1d4ed8;
  }
`;
const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  position: relative;
  padding-left: 14px;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 22px;
    background: #1d4ed8;
    border-radius: 2px;
  }
`;
const ProductCount = styled.span`
  font-size: 13px;
  color: #64748b;
  margin-left: auto;
`;
const ContentInner = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 1.5rem;
`;
const FilterBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 10px;
`;
const FilterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;
const FilterLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
`;
const SortBtn = styled.button`
  height: 32px;
  padding: 0 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid ${(p) => (p.$active ? "#1d4ed8" : "#e2e8f0")};
  background: ${(p) => (p.$active ? "#eff6ff" : "white")};
  color: ${(p) => (p.$active ? "#1d4ed8" : "#475569")};
  &:hover {
    border-color: #1d4ed8;
    color: #1d4ed8;
  }
`;
const FilterRight = styled.div`
  display: flex;
  align-items: center;
`;
const StockToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid ${(p) => (p.$active ? "#16a34a" : "#e2e8f0")};
  background: ${(p) => (p.$active ? "#f0fdf4" : "white")};
  color: ${(p) => (p.$active ? "#16a34a" : "#475569")};
`;
const ToggleDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => (p.$active ? "#16a34a" : "#cbd5e1")};
  transition: background 0.15s;
`;
const StatusText = styled.p`
  font-size: 15px;
  color: #64748b;
  padding: 3rem 0;
  text-align: center;
`;
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 0;
  gap: 12px;
`;
const EmptyText = styled.p`
  font-size: 15px;
  color: #94a3b8;
`;
const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 1rem;
`;
const ProductCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  transition:
    box-shadow 0.15s,
    transform 0.15s;
  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;
const DiscountInlineBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: white;
  background: #dc2626;
  border-radius: 4px;
  padding: 2px 6px;
  flex-shrink: 0;
`;
const PriceTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PriceRowBottom = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const SaveBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #16a34a;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 4px;
  padding: 1px 6px;
  white-space: nowrap;
`;

const SalePrice = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #dc2626;
`;

const OutBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #94a3b8;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  z-index: 1;
`;
const ProductImg = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
`;
const ProductBody = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;
const ProductCat = styled.p`
  font-size: 11px;
  color: #64748b;
  margin: 0 0 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;
const ProductTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
const PriceBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 6px;
  min-height: 44px;
`;
const NewPrice = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #1d4ed8;
`;
const OldPrice = styled.span`
  font-size: 12px;
  color: #94a3b8;
  text-decoration: line-through;
`;
const StockRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${(p) => (p.$out ? "#dc2626" : p.$low ? "#d97706" : "#16a34a")};
`;
const StockDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
`;
const AddButton = styled.button`
  width: 100%;
  height: 36px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  margin-top: auto;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  background: ${(p) => (p.disabled ? "#e2e8f0" : "#1d4ed8")};
  color: ${(p) => (p.disabled ? "#94a3b8" : "white")};
  transition:
    opacity 0.15s,
    background 0.15s;
  &:hover:not(:disabled) {
    background: #1e40af;
  }
`;
