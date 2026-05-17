import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { url } from "../../../features/api";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getTotals } from "../../../features/cart/CartSlice";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  /* ── Scroll lên đầu khi vào trang ── */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${url}/products/find/${id}`);
        setProduct(res.data);
        setSelectedImage(res.data.image);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, userId: auth._id }));
    dispatch(getTotals());
  };

  if (!product) return <Loading>Đang tải sản phẩm...</Loading>;

  const discountedPrice =
    product.isDiscount && product.discountPercent > 0
      ? product.price * (1 - product.discountPercent / 100)
      : null;

  const images = product.images?.length > 0 ? product.images : [product.image];

  return (
    <Wrapper>
      <SectionInner>
        {/* BREADCRUMB */}
        <Breadcrumb>
          <BreadBtn onClick={() => navigate("/")}>Trang chủ</BreadBtn>
          <BreadSep>›</BreadSep>
          <BreadCat>{product.category || "Sản phẩm"}</BreadCat>
          <BreadSep>›</BreadSep>
          <BreadCurrent>{product.name}</BreadCurrent>
        </Breadcrumb>

        <Card>
          {/* ══ ẢNH ══ */}
          <ImageSection>
            {product.isDiscount && product.discountPercent > 0 && (
              <DiscountBadge>-{product.discountPercent}%</DiscountBadge>
            )}
            {product.quantity === 0 && <OutBadge>Hết hàng</OutBadge>}

            <MainImageWrap>
              <MainImage src={selectedImage} alt={product.name} />
            </MainImageWrap>

            {images.length > 1 && (
              <ThumbnailRow>
                {images.map((img, index) => (
                  <Thumbnail
                    key={index}
                    src={img}
                    alt=""
                    $active={selectedImage === img}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </ThumbnailRow>
            )}
          </ImageSection>

          {/* ══ THÔNG TIN ══ */}
          <InfoSection>
            <CategoryTag>{product.category}</CategoryTag>
            <ProductName>{product.name}</ProductName>

            {/* GIÁ */}
            <PriceBlock>
              {discountedPrice ? (
                <>
                  <SalePrice>
                    {discountedPrice.toLocaleString("vi-VN")}₫
                  </SalePrice>
                  <PriceRow>
                    <OldPrice>
                      {product.price?.toLocaleString("vi-VN")}₫
                    </OldPrice>
                    <SaveBadge>
                      Tiết kiệm{" "}
                      {(product.price - discountedPrice).toLocaleString(
                        "vi-VN",
                      )}
                      ₫
                    </SaveBadge>
                  </PriceRow>
                </>
              ) : (
                <RegularPrice>
                  {product.price?.toLocaleString("vi-VN")}₫
                </RegularPrice>
              )}
            </PriceBlock>

            {/* TỒN KHO */}
            <StockRow
              $out={product.quantity === 0}
              $low={product.quantity <= 3 && product.quantity > 0}
            >
              <StockDot />
              {product.quantity === 0
                ? "Hết hàng"
                : product.quantity <= 3
                  ? `Chỉ còn ${product.quantity} sản phẩm`
                  : `Còn hàng (${product.quantity} sản phẩm)`}
            </StockRow>

            <Divider />

            {/* THÔNG TIN NHANH */}
            <QuickInfo>
              <QuickItem>
                <QuickIcon>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </QuickIcon>
                <QuickText>
                  <QuickLabel>Bảo hành</QuickLabel>
                  <QuickValue>{product.warranty || "12 tháng"}</QuickValue>
                </QuickText>
              </QuickItem>
              <QuickItem>
                <QuickIcon>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="1" y="3" width="15" height="13" rx="2" />
                    <path d="M16 8h4l3 4v3h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </QuickIcon>
                <QuickText>
                  <QuickLabel>Giao hàng</QuickLabel>
                  <QuickValue>Toàn quốc</QuickValue>
                </QuickText>
              </QuickItem>
              <QuickItem>
                <QuickIcon>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </QuickIcon>
                <QuickText>
                  <QuickLabel>Hàng</QuickLabel>
                  <QuickValue>Chính hãng</QuickValue>
                </QuickText>
              </QuickItem>
            </QuickInfo>

            <Divider />

            {/* NÚT THÊM VÀO GIỎ */}
            <ActionRow>
              <AddButton
                disabled={product.quantity === 0}
                onClick={handleAddToCart}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {product.quantity === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
              </AddButton>

              <BackButton onClick={() => navigate(-1)}>← Quay lại</BackButton>
            </ActionRow>
          </InfoSection>
        </Card>

        {/* MÔ TẢ */}
        <DescCard>
          <DescTitle>
            <span>Mô tả sản phẩm</span>
          </DescTitle>
          <DescContent>{product.desc || "Đang cập nhật mô tả..."}</DescContent>
        </DescCard>
      </SectionInner>
    </Wrapper>
  );
};

export default ProductPage;

/* ═══════════════════════════════════════
   STYLED COMPONENTS
═══════════════════════════════════════ */

const Wrapper = styled.div`
  background: #f1f5f9;
  min-height: 100vh;
  padding: 2rem 0 3rem;
`;

const SectionInner = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Loading = styled.p`
  padding: 4rem 2rem;
  font-size: 15px;
  color: #64748b;
  text-align: center;
`;

/* BREADCRUMB */
const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
`;

const BreadBtn = styled.button`
  background: none;
  border: none;
  color: #1d4ed8;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
`;

const BreadSep = styled.span`
  color: #94a3b8;
`;

const BreadCat = styled.span`
  color: #64748b;
`;

const BreadCurrent = styled.span`
  color: #1e293b;
  font-weight: 500;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* MAIN CARD */
const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  gap: 0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

/* IMAGE */
const ImageSection = styled.div`
  position: relative;
  width: 420px;
  flex-shrink: 0;
  padding: 1.5rem;
  border-right: 1px solid #f1f5f9;
  background: #fafafa;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #f1f5f9;
  }
`;

const DiscountBadge = styled.span`
  position: absolute;
  top: 16px;
  left: 16px;
  background: #dc2626;
  color: white;
  font-size: 13px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  z-index: 1;
`;

const OutBadge = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  background: #94a3b8;
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  z-index: 1;
`;

const MainImageWrap = styled.div`
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: white;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.03);
  }
`;

const ThumbnailRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

const Thumbnail = styled.img`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid ${(p) => (p.$active ? "#1d4ed8" : "#e2e8f0")};
  box-shadow: ${(p) => (p.$active ? "0 0 0 3px rgba(29,78,216,0.12)" : "none")};
  transition: 0.15s;
  &:hover {
    border-color: #93c5fd;
  }
`;

/* INFO */
const InfoSection = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CategoryTag = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: #1d4ed8;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  padding: 3px 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: fit-content;
`;

const ProductName = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
  margin: 0;
`;

const PriceBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SalePrice = styled.span`
  font-size: 28px;
  font-weight: 800;
  color: #dc2626;
`;

const RegularPrice = styled.span`
  font-size: 28px;
  font-weight: 800;
  color: #1d4ed8;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const OldPrice = styled.span`
  font-size: 16px;
  color: #94a3b8;
  text-decoration: line-through;
`;

const SaveBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #16a34a;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  padding: 2px 8px;
`;

const StockRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: ${(p) => (p.$out ? "#dc2626" : p.$low ? "#d97706" : "#16a34a")};
`;

const StockDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
`;

const Divider = styled.div`
  height: 1px;
  background: #f1f5f9;
`;

/* QUICK INFO */
const QuickInfo = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const QuickItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  flex: 1;
  min-width: 100px;
`;

const QuickIcon = styled.div`
  color: #1d4ed8;
  display: flex;
  flex-shrink: 0;
`;

const QuickText = styled.div`
  display: flex;
  flex-direction: column;
`;

const QuickLabel = styled.span`
  font-size: 11px;
  color: #64748b;
`;

const QuickValue = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
`;

/* ACTION */
const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 0.5rem;
  flex-wrap: wrap;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 46px;
  padding: 0 28px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  border: none;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  background: ${(p) => (p.disabled ? "#e2e8f0" : "#1d4ed8")};
  color: ${(p) => (p.disabled ? "#94a3b8" : "white")};
  transition:
    background 0.15s,
    transform 0.1s;

  &:hover:not(:disabled) {
    background: #1e40af;
    transform: translateY(-1px);
  }
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

const BackButton = styled.button`
  height: 46px;
  padding: 0 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #1e293b;
  }
`;

/* DESC */
const DescCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
`;

const DescTitle = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;

  span {
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
    position: relative;
    padding-left: 12px;

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
  }
`;

const DescContent = styled.p`
  padding: 1.25rem 1.5rem;
  font-size: 14px;
  color: #475569;
  line-height: 1.8;
  white-space: pre-line;
  margin: 0;
`;
