import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { url } from "../../../features/api";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getTotals } from "../../../features/cart/CartSlice";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

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

  if (!product) return <Loading>Đang tải...</Loading>;

  return (
    <Wrapper>
      <BackButton onClick={() => navigate("/")}>
        ← Quay lại trang chủ
      </BackButton>
      <Card>
        {/* ẢNH */}
        <ImageContainer>
          <MainImage src={selectedImage} alt={product.name} />

          <ThumbnailRow>
            {(product.images?.length > 0
              ? product.images
              : [product.image]
            ).map((img, index) => (
              <Thumbnail
                key={index}
                src={img}
                alt=""
                $active={selectedImage === img}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </ThumbnailRow>
        </ImageContainer>

        <Divider />

        {/* THÔNG TIN */}
        <InfoSection>
          <ProductName>{product.name}</ProductName>

          {/* GIÁ */}
          {product.isDiscount && product.discountPercent > 0 ? (
            <>
              <PriceValue>
                {(
                  product.price *
                  (1 - product.discountPercent / 100)
                ).toLocaleString("vi-VN")}
                ₫
              </PriceValue>
              <OldPrice>{product.price?.toLocaleString("vi-VN")}₫</OldPrice>
            </>
          ) : (
            <PriceValue>{product.price?.toLocaleString("vi-VN")}₫</PriceValue>
          )}

          {/* TỒN KHO */}
          <Stock
            $out={product.quantity === 0}
            $low={product.quantity <= 3 && product.quantity > 0}
          >
            {product.quantity === 0
              ? "Hết hàng"
              : product.quantity <= 3
                ? `Chỉ còn ${product.quantity} sản phẩm`
                : `Còn hàng: ${product.quantity}`}
          </Stock>

          {/* MÔ TẢ */}
          <SectionTitle>Mô tả</SectionTitle>
          <Desc>{product.desc || "Đang cập nhật..."}</Desc>

          {/* BẢO HÀNH */}
          <SectionTitle>Bảo hành</SectionTitle>
          <Value>{product.warranty || "12 tháng"}</Value>

          {/* NÚT THÊM VÀO GIỎ */}
          <AddButton
            disabled={product.quantity === 0}
            onClick={handleAddToCart}
          >
            {product.quantity === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
          </AddButton>
        </InfoSection>
      </Card>
    </Wrapper>
  );
};

export default ProductPage;

/* ================= STYLES ================= */

const Loading = styled.p`
  padding: 2rem;
  font-size: 15px;
  color: #64748b;
`;

const Wrapper = styled.div`
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  max-width: 100%;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ImageContainer = styled.div`
  flex-shrink: 0;
  width: 260px;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const MainImage = styled.img`
  width: 100%;

  aspect-ratio: 1;

  object-fit: cover;

  border-radius: 8px;

  border: 1px solid #e2e8f0;
`;

const ThumbnailRow = styled.div`
  display: flex;

  gap: 8px;

  margin-top: 10px;
`;

const Thumbnail = styled.img`
  width: 70px;

  height: 70px;

  object-fit: cover;

  border-radius: 8px;

  cursor: pointer;

  border: 2px solid ${(p) => (p.$active ? "#2563eb" : "#e2e8f0")};

  transition: 0.15s;

  &:hover {
    border-color: #93c5fd;
  }
`;

const Divider = styled.div`
  width: 1px;
  align-self: stretch;
  background: #f1f5f9;
  flex-shrink: 0;
`;

const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ProductName = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const PriceValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #1d4ed8;
`;

const Stock = styled.p`
  font-size: 13px;
  font-weight: 600;
  margin: 0;
  color: ${(p) => (p.$out ? "#dc2626" : p.$low ? "#d97706" : "#16a34a")};
`;

const SectionTitle = styled.h3`
  font-size: 13px;
  font-weight: 800;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 0.8rem;
  margin-bottom: 0;
`;

const Desc = styled.p`
  font-size: 14px;
  color: #475569;
  white-space: pre-line;
  margin: 0;
`;

const Value = styled.span`
  font-size: 14px;
  color: #475569;
`;

const OldPrice = styled.span`
  font-size: 14px;
  color: #94a3b8;
  text-decoration: line-through;
`;

const AddButton = styled.button`
  margin-top: 0.5rem;
  width: fit-content;
  padding: 0 1.5rem;
  height: 40px;
  border-radius: 8px;
  font-size: 15px;
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

const BackButton = styled.button`
  margin-bottom: 1rem;
  padding: 0 1rem;
  height: 36px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  background: #1e293b;
  color: #ffffff;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: #0f172a;
  }
`;
