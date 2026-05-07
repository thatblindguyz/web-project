import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { url } from "../../../features/api";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${url}/products/find/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <Loading>Loading...</Loading>;

  return (
    <Wrapper>
      <Card>
        {/* IMAGE */}
        <ImageContainer>
          <img src={product.image} alt={product.name} />
        </ImageContainer>

        <Divider />

        {/* INFO */}
        <InfoSection>
          <ProductName>{product.name}</ProductName>

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

          <SectionTitle>Description</SectionTitle>

          <Desc>{product.desc || "Updating..."}</Desc>

          {/* WARRANTY */}
          <SectionTitle>Warranty</SectionTitle>
          <Value>{product.warranty || "12 months"}</Value>
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

  img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  @media (max-width: 600px) {
    width: 100%;
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

const ShortDesc = styled.p`
  font-size: 14px;
  color: #475569;
  margin: 4px 0;
`;

const SectionTitle = styled.h3`
  font-size: 13px;
  font-weight: 800;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 0.8rem;
`;

const Desc = styled.p`
  font-size: 14px;
  color: #475569;
  white-space: pre-line; /* ⭐ giữ xuống dòng */
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
