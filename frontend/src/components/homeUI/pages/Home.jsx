import { useGetProductsQuery } from "../../../features/product/ProductAPI";
import { useDispatch } from "react-redux";
import { addToCart, getTotals } from "../../../features/cart/CartSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

const Home = () => {
  const { data, error, isLoading } = useGetProductsQuery();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const filteredProducts = data?.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    dispatch(getTotals());
  };

  return (
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
                <ShortDesc>{product.shortDesc || "No description"}</ShortDesc>
                <PriceBlock>
                  {product.isDiscount && product.discountPercent > 0 ? (
                    <>
                      <NewPrice>
                        $
                        {(
                          product.price *
                          (1 - product.discountPercent / 100)
                        ).toLocaleString()}
                      </NewPrice>
                      <OldPriceRow>
                        <OldPrice>${product.price?.toLocaleString()}</OldPrice>
                        <DiscountBadge>
                          -{product.discountPercent}%
                        </DiscountBadge>
                      </OldPriceRow>
                    </>
                  ) : (
                    <Price>${product.price?.toLocaleString()}</Price>
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
`;

const ShortDesc = styled.p`
  font-size: 13px;
  color: #64748b;
  margin: 0 0 6px;
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
