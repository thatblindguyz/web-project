import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../../features/api";

/* ============================
   COMPONENT
============================ */
const ProductDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await axios.get(`${url}/products/find/${params.id}`);
        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response?.data);
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  /* ================= LOADING ================= */
  if (loading) return <Loading>Loading...</Loading>;

  /* ================= UI ================= */
  return (
    <Wrapper>
      {/* ===== HEADER ===== */}
      <Header>
        <Left>
          <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
          <PageTitle>Product Detail</PageTitle>
        </Left>
        <CodeBadge>#{product.code}</CodeBadge>
      </Header>

      {/* ===== MAIN CARD ===== */}
      <Card>
        <ImageContainer>
          <img src={product.image} alt={product.name} />
        </ImageContainer>

        <Divider />

        <InfoSection>
          <ProductName>{product.name}</ProductName>

          <FieldList>
            <Field>
              <Label>Code</Label>
              <Value mono>#{product.code}</Value>
            </Field>
            <Field>
              <Label>Category</Label>
              <Value>{product.category}</Value>
            </Field>
            <Field>
              <Label>Description</Label>
              <Value>{product.desc}</Value>
            </Field>
            <Field style={{ justifyContent: "space-between" }}>
              {/* PRICE */}
              <div style={{ display: "flex", gap: "8px" }}>
                <Label>Price</Label>
                <PriceValue>${product.price?.toLocaleString()}</PriceValue>
              </div>

              {/* QUANTITY */}
              <div style={{ display: "flex", gap: "8px" }}>
                <Label>Stock</Label>
                <Value>{product.quantity}</Value>
              </div>
            </Field>
          </FieldList>
        </InfoSection>
      </Card>
    </Wrapper>
  );
};

export default ProductDetail;

/* ================= STYLES ================= */
const Loading = styled.p`
  padding: 2rem;
  font-size: 16px;
  color: #475569;
`;

const Wrapper = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  background: #1e293b;
  color: #f8fafc;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #0f172a;
  }
`;

const PageTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const CodeBadge = styled.span`
  font-family: monospace;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 4px 10px;
  letter-spacing: 0.04em;
`;

/* ===== CARD ===== */
const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 2rem;
  align-items: flex-start;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ImageContainer = styled.div`
  flex-shrink: 0;
  width: 220px;

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
  gap: 1.25rem;
  min-width: 0;
`;

const ProductName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

/* ===== FIELD LIST ===== */
const FieldList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Field = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const Label = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  flex-shrink: 0;
`;

const Value = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: #0f172a;
  font-family: ${(p) => (p.mono ? "monospace" : "inherit")};
  text-align: right;
`;

const PriceValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
`;
