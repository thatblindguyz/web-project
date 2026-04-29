import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";

import { url } from "../../../features/api";

const ProductDetail = () => {
  const params = useParams();

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

  if (loading) {
    return <h2>Loading...</h2>;
  }

  /* ================= UI ================= */

  return (
    <StyledProduct>
      <ProductContainer>
        <ImageContainer>
          <img src={product.image} alt={product.name} />
        </ImageContainer>

        <ProductInfo>
          <h2>{product.name}</h2>

          <p>
            <strong>Code:</strong> {product.code}
          </p>

          <p>
            <strong>Category:</strong> {product.category}
          </p>

          <p>
            <strong>Description:</strong> {product.desc}
          </p>

          <p>
            <strong>Price:</strong> ${product.price}
          </p>
        </ProductInfo>
      </ProductContainer>
    </StyledProduct>
  );
};

export default ProductDetail;

/* ================= STYLES ================= */

const StyledProduct = styled.div`
  margin: 3rem;
  display: flex;
  justify-content: center;
`;

const ProductContainer = styled.div`
  max-width: 700px;
  width: 100%;

  display: flex;
  gap: 2rem;

  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

  border-radius: 5px;

  padding: 2rem;
`;

const ImageContainer = styled.div`
  flex: 1;

  img {
    width: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;

  gap: 10px;
`;
