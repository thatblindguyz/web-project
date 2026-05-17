import { useGetProductsQuery } from "../../../features/product/ProductAPI";
import { useDispatch, useSelector } from "react-redux"; // ← MERGE: thêm useSelector
import { addToCart, getTotals } from "../../../features/cart/CartSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useState, useEffect } from "react";
import FlashSale from "./FlashSale";

const SLIDES = [
  {
    id: 1,
    title: "HIỆU NĂNG ĐỈNH CAO",
    subtitle: "CHIẾN GAME CỰC CHÁY",
    desc: "PC GAMING CHÍNH HÃNG – GIÁ TỐT NHẤT",
    bg: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
    cta: "Xem ngay",
  },
  {
    id: 2,
    title: "VGA THẾ HỆ MỚI",
    subtitle: "RTX 4090 – RX 9070 XT",
    desc: "CARD ĐỒ HỌA CHÍNH HÃNG – BẢO HÀNH 36 THÁNG",
    bg: "linear-gradient(135deg, #1a0533 0%, #3b0764 100%)",
    cta: "Khám phá",
  },
  {
    id: 3,
    title: "CPU INTEL & AMD",
    subtitle: "HIỆU NĂNG VƯỢT TRỘI",
    desc: "CORE I9 – RYZEN 9 – GIÁ SỈ THÁNG NÀY",
    bg: "linear-gradient(135deg, #042f2e 0%, #065f46 100%)",
    cta: "Mua ngay",
  },
];

const TRUST_ITEMS = [
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Hàng chính hãng",
    sub: "100%",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Bảo hành",
    sub: "Đến 36 tháng",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4l3 4v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: "Giao hàng",
    sub: "Toàn quốc",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.08 1.2 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    title: "Hỗ trợ 24/7",
    sub: "Tận tâm",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    title: "Giá tốt nhất",
    sub: "Thị trường",
  },
];

const Home = () => {
  const { data, error, isLoading } = useGetProductsQuery();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const KNOWN_CATEGORIES = ["gpu", "cpu", "ram", "monitor"];
  const selectedCategory = KNOWN_CATEGORIES.includes(
    search.toLowerCase().trim(),
  )
    ? search.toLowerCase().trim()
    : "";
  const auth = useSelector((state) => state.auth);
  const [slide, setSlide] = useState(0);

  /* ── Scroll lên đầu khi vào trang ── */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProducts = (data || []).filter((product) => {
    const keyword = search.toLowerCase().trim();

    const keywords = keyword.split(" ");

    const searchableText = `
    ${product.name || ""}
    ${product.category || ""}
    ${product.shortDesc || ""}
    ${product.desc || ""}
  `.toLowerCase();

    return keywords.every((word) => searchableText.includes(word));
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* Auto-advance slider */
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  /* ← MERGE: truyền userId */
  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, userId: auth._id }));
    dispatch(getTotals());
  };

  const gpuProducts = filteredProducts?.filter((p) => p.category === "GPU");

  const cpuProducts = filteredProducts?.filter((p) => p.category === "CPU");

  const ramProducts = filteredProducts?.filter((p) => p.category === "RAM");

  const monitorProducts = filteredProducts?.filter(
    (p) => p.category === "Monitor",
  );

  return (
    <Wrapper>
      {/* ════════ HERO BANNER ════════ */}
      {!search && (
        <HeroSection>
          <HeroSlider>
            {SLIDES.map((s, i) => (
              <HeroSlide key={s.id} $bg={s.bg} $active={i === slide}>
                <HeroContent>
                  <HeroTitle>{s.title}</HeroTitle>
                  <HeroSubtitle>{s.subtitle}</HeroSubtitle>
                  <HeroDesc>{s.desc}</HeroDesc>
                  <HeroTrustRow>
                    {TRUST_ITEMS.slice(0, 4).map((t) => (
                      <HeroTrustItem key={t.title}>
                        <HeroTrustIcon>{t.icon}</HeroTrustIcon>
                        <div>
                          <HeroTrustTitle>{t.title}</HeroTrustTitle>
                          <HeroTrustSub>{t.sub}</HeroTrustSub>
                        </div>
                      </HeroTrustItem>
                    ))}
                  </HeroTrustRow>
                  <HeroCTA onClick={() => navigate("/")}>{s.cta}</HeroCTA>
                </HeroContent>
                <HeroDecor>
                  <DecorCircle
                    $size={320}
                    $top={-60}
                    $right={-60}
                    $opacity={0.06}
                  />
                  <DecorCircle
                    $size={200}
                    $top={40}
                    $right={80}
                    $opacity={0.05}
                  />
                  <DecorCircle
                    $size={140}
                    $top={140}
                    $right={20}
                    $opacity={0.08}
                  />
                </HeroDecor>
              </HeroSlide>
            ))}

            <SliderBtn
              $side="left"
              onClick={() =>
                setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length)
              }
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </SliderBtn>
            <SliderBtn
              $side="right"
              onClick={() => setSlide((s) => (s + 1) % SLIDES.length)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </SliderBtn>

            <SliderDots>
              {SLIDES.map((_, i) => (
                <Dot
                  key={i}
                  $active={i === slide}
                  onClick={() => setSlide(i)}
                />
              ))}
            </SliderDots>
          </HeroSlider>
        </HeroSection>
      )}

      {/* ════════ TRUST BADGES ════════ */}
      {!search && (
        <TrustBar>
          <TrustInner>
            {TRUST_ITEMS.map((item) => (
              <TrustItem key={item.title}>
                <TrustIcon>{item.icon}</TrustIcon>
                <TrustText>
                  <TrustTitle>{item.title}</TrustTitle>
                  <TrustSub>{item.sub}</TrustSub>
                </TrustText>
              </TrustItem>
            ))}
          </TrustInner>
        </TrustBar>
      )}

      {/* ════════ FLASH SALE ════════ */}
      {!search && data && (
        <FlashSaleWrapper>
          <FlashSale products={data} />
        </FlashSaleWrapper>
      )}

      {/* ════════ PRODUCTS ════════ */}
      {/* ════════ PRODUCTS ════════ */}
      <ProductSection>
        <SectionInner>
          {isLoading ? (
            <StatusText>Đang tải sản phẩm...</StatusText>
          ) : error ? (
            <StatusText>Lỗi tải sản phẩm.</StatusText>
          ) : (
            <>
              {filteredProducts?.length === 0 ? (
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

                  <EmptyText>Không tìm thấy sản phẩm nào</EmptyText>
                </EmptyState>
              ) : (
                <>
                  {/* GPU */}
                  {(!selectedCategory || selectedCategory === "gpu") &&
                    gpuProducts?.length > 0 && (
                      <CategoryBlock>
                        <CategoryHeader>
                          <SectionTitle>Card màn hình (GPU)</SectionTitle>
                          <ViewAllBtn
                            onClick={() => {
                              navigate(`/category/GPU`);
                              window.scrollTo(0, 0);
                            }}
                          >
                            Xem tất cả +
                          </ViewAllBtn>
                        </CategoryHeader>
                        <ProductGrid>
                          {gpuProducts?.slice(0, 4).map((product) => (
                            <ProductCard
                              key={product._id}
                              onClick={() =>
                                navigate(`/product/${product._id}`)
                              }
                            >
                              {product.quantity === 0 && (
                                <OutBadge>Hết hàng</OutBadge>
                              )}
                              <ProductImg
                                src={product.image}
                                alt={product.name}
                              />
                              <ProductBody>
                                <ProductCat>
                                  {product.shortDesc || "GPU"}
                                </ProductCat>
                                <ProductTitle>{product.name}</ProductTitle>
                                <PriceBlock>
                                  {product.isDiscount &&
                                  product.discountPercent > 0 ? (
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
                                          {product.price?.toLocaleString(
                                            "vi-VN",
                                          )}
                                          ₫
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
                                  $low={
                                    product.quantity <= 3 &&
                                    product.quantity > 0
                                  }
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
                                  {product.quantity === 0
                                    ? "Hết hàng"
                                    : "Thêm vào giỏ"}
                                </AddButton>
                              </ProductBody>
                            </ProductCard>
                          ))}
                        </ProductGrid>
                      </CategoryBlock>
                    )}

                  {/* CPU */}
                  {(!selectedCategory || selectedCategory === "cpu") &&
                    cpuProducts?.length > 0 && (
                      <CategoryBlock>
                        <CategoryHeader>
                          <SectionTitle>Bộ vi xử lý (CPU)</SectionTitle>
                          <ViewAllBtn
                            onClick={() => {
                              navigate(`/category/CPU`);
                              window.scrollTo(0, 0);
                            }}
                          >
                            Xem tất cả +
                          </ViewAllBtn>
                        </CategoryHeader>
                        <ProductGrid>
                          {cpuProducts?.slice(0, 4).map((product) => (
                            <ProductCard
                              key={product._id}
                              onClick={() =>
                                navigate(`/product/${product._id}`)
                              }
                            >
                              {product.quantity === 0 && (
                                <OutBadge>Hết hàng</OutBadge>
                              )}
                              <ProductImg
                                src={product.image}
                                alt={product.name}
                              />
                              <ProductBody>
                                <ProductCat>
                                  {product.shortDesc || "CPU"}
                                </ProductCat>
                                <ProductTitle>{product.name}</ProductTitle>
                                <PriceBlock>
                                  {product.isDiscount &&
                                  product.discountPercent > 0 ? (
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
                                          {product.price?.toLocaleString(
                                            "vi-VN",
                                          )}
                                          ₫
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
                                  $low={
                                    product.quantity <= 3 &&
                                    product.quantity > 0
                                  }
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
                                  {product.quantity === 0
                                    ? "Hết hàng"
                                    : "Thêm vào giỏ"}
                                </AddButton>
                              </ProductBody>
                            </ProductCard>
                          ))}
                        </ProductGrid>
                      </CategoryBlock>
                    )}

                  {/* RAM */}
                  {(!selectedCategory || selectedCategory === "ram") &&
                    ramProducts?.length > 0 && (
                      <CategoryBlock>
                        <CategoryHeader>
                          <SectionTitle>Bộ nhớ trong (RAM)</SectionTitle>
                          <ViewAllBtn
                            onClick={() => {
                              navigate(`/category/RAM`);
                              window.scrollTo(0, 0);
                            }}
                          >
                            Xem tất cả +
                          </ViewAllBtn>
                        </CategoryHeader>
                        <ProductGrid>
                          {ramProducts?.slice(0, 4).map((product) => (
                            <ProductCard
                              key={product._id}
                              onClick={() =>
                                navigate(`/product/${product._id}`)
                              }
                            >
                              {product.quantity === 0 && (
                                <OutBadge>Hết hàng</OutBadge>
                              )}
                              <ProductImg
                                src={product.image}
                                alt={product.name}
                              />
                              <ProductBody>
                                <ProductCat>
                                  {product.shortDesc || "RAM"}
                                </ProductCat>
                                <ProductTitle>{product.name}</ProductTitle>
                                <PriceBlock>
                                  {product.isDiscount &&
                                  product.discountPercent > 0 ? (
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
                                          {product.price?.toLocaleString(
                                            "vi-VN",
                                          )}
                                          ₫
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
                                  $low={
                                    product.quantity <= 3 &&
                                    product.quantity > 0
                                  }
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
                                  {product.quantity === 0
                                    ? "Hết hàng"
                                    : "Thêm vào giỏ"}
                                </AddButton>
                              </ProductBody>
                            </ProductCard>
                          ))}
                        </ProductGrid>
                      </CategoryBlock>
                    )}

                  {/* MONITOR */}
                  {(!selectedCategory || selectedCategory === "monitor") &&
                    monitorProducts?.length > 0 && (
                      <CategoryBlock>
                        <CategoryHeader>
                          <SectionTitle>Màn hình máy tính</SectionTitle>
                          <ViewAllBtn
                            onClick={() => {
                              navigate(`/category/Monitor`);
                              window.scrollTo(0, 0);
                            }}
                          >
                            Xem tất cả +
                          </ViewAllBtn>
                        </CategoryHeader>
                        <ProductGrid>
                          {monitorProducts?.slice(0, 4).map((product) => (
                            <ProductCard
                              key={product._id}
                              onClick={() =>
                                navigate(`/product/${product._id}`)
                              }
                            >
                              {product.quantity === 0 && (
                                <OutBadge>Hết hàng</OutBadge>
                              )}
                              <ProductImg
                                src={product.image}
                                alt={product.name}
                              />
                              <ProductBody>
                                <ProductCat>
                                  {product.shortDesc || "Monitor"}
                                </ProductCat>
                                <ProductTitle>{product.name}</ProductTitle>
                                <PriceBlock>
                                  {product.isDiscount &&
                                  product.discountPercent > 0 ? (
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
                                          {product.price?.toLocaleString(
                                            "vi-VN",
                                          )}
                                          ₫
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
                                  $low={
                                    product.quantity <= 3 &&
                                    product.quantity > 0
                                  }
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
                                  {product.quantity === 0
                                    ? "Hết hàng"
                                    : "Thêm vào giỏ"}
                                </AddButton>
                              </ProductBody>
                            </ProductCard>
                          ))}
                        </ProductGrid>
                      </CategoryBlock>
                    )}
                </>
              )}
            </>
          )}
        </SectionInner>
      </ProductSection>
    </Wrapper>
  );
};

export default Home;

/* ═══════════════════════════════════════
   STYLED COMPONENTS
═══════════════════════════════════════ */
const Wrapper = styled.div`
  background: #f1f5f9;
  min-height: 100vh;
`;
const StatusText = styled.p`
  font-size: 15px;
  color: #64748b;
  padding: 3rem 0;
  text-align: center;
`;
const HeroSection = styled.section`
  width: 100%;
`;
const HeroSlider = styled.div`
  position: relative;
  height: 380px;
  overflow: hidden;
`;
const fadeIn = keyframes`from { opacity: 0; transform: scale(1.03); } to { opacity: 1; transform: scale(1); }`;
const HeroSlide = styled.div`
  position: absolute;
  inset: 0;
  background: ${(p) => p.$bg};
  display: flex;
  align-items: center;
  padding: 0 5%;
  opacity: ${(p) => (p.$active ? 1 : 0)};
  pointer-events: ${(p) => (p.$active ? "auto" : "none")};
  transition: opacity 0.6s ease;
  animation: ${(p) => (p.$active ? fadeIn : "none")} 0.6s ease;
  overflow: hidden;
`;
const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 600px;
`;
const HeroTitle = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: white;
  line-height: 1.15;
  letter-spacing: -0.01em;
`;
const HeroSubtitle = styled.h2`
  font-size: 36px;
  font-weight: 900;
  color: #60a5fa;
  line-height: 1.1;
  margin: 4px 0 8px;
`;
const HeroDesc = styled.p`
  font-size: 13px;
  color: #94a3b8;
  letter-spacing: 0.08em;
  font-weight: 600;
  margin-bottom: 18px;
`;
const HeroTrustRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 22px;
  flex-wrap: wrap;
`;
const HeroTrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  color: rgba(255, 255, 255, 0.7);
`;
const HeroTrustIcon = styled.div`
  color: #60a5fa;
  display: flex;
  svg {
    width: 18px;
    height: 18px;
  }
`;
const HeroTrustTitle = styled.div`
  font-size: 12px;
  color: #e2e8f0;
  font-weight: 600;
  line-height: 1.2;
`;
const HeroTrustSub = styled.div`
  font-size: 11px;
  color: #94a3b8;
`;
const HeroCTA = styled.button`
  height: 44px;
  padding: 0 28px;
  background: #1d4ed8;
  color: white;
  font-size: 15px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition:
    background 0.15s,
    transform 0.15s;
  &:hover {
    background: #1e40af;
    transform: translateY(-1px);
  }
`;
const HeroDecor = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;
const DecorCircle = styled.div`
  position: absolute;
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  top: ${(p) => p.$top}px;
  right: ${(p) => p.$right}px;
  border-radius: 50%;
  background: white;
  opacity: ${(p) => p.$opacity};
`;
const SliderBtn = styled.button`
  position: absolute;
  top: 50%;
  ${(p) => p.$side}: 16px;
  transform: translateY(-50%);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  transition: background 0.15s;
  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;
const SliderDots = styled.div`
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 3;
`;
const Dot = styled.div`
  width: ${(p) => (p.$active ? 20 : 8)}px;
  height: 8px;
  border-radius: 4px;
  background: ${(p) => (p.$active ? "#1d4ed8" : "rgba(255,255,255,0.4)")};
  cursor: pointer;
  transition: all 0.3s;
`;
const TrustBar = styled.div`
  background: white;
  border-bottom: 1px solid #e2e8f0;
`;
const TrustInner = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 0;
  flex: 1;
  border-right: 1px solid #f1f5f9;
  justify-content: center;
  &:last-child {
    border-right: none;
  }
`;
const TrustIcon = styled.div`
  color: #1d4ed8;
  display: flex;
  flex-shrink: 0;
`;
const TrustText = styled.div``;
const TrustTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.2;
`;
const TrustSub = styled.div`
  font-size: 12px;
  color: #64748b;
`;
const ProductSection = styled.section`
  padding: 2rem 0;
`;
const SectionInner = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;
const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
`;
const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
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
const SectionCount = styled.span`
  font-size: 13px;
  color: #64748b;
`;
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  display: flex; /* ← thêm */
  flex-direction: column; /* ← thêm */
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

const SalePrice = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #dc2626;
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
  margin-top: auto; /* ← luôn dính xuống đáy */
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

const FlashSaleWrapper = styled.div`
  max-width: 1320px;
  margin: 1.5rem auto 0;
  padding: 0 1.5rem;
`;

const CategoryBlock = styled.div`
  margin-bottom: 3.5rem;
  &:last-child {
    margin-bottom: 0;
  }
`;
const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
`;

const ViewAllBtn = styled.button`
  font-size: 13px;
  font-weight: 700;
  color: #1d4ed8;
  background: none;
  border: none;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: opacity 0.15s;
  white-space: nowrap;
  &:hover {
    opacity: 0.75;
    text-decoration: underline;
  }
`;
