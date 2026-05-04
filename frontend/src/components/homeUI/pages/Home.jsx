import { useGetProductsQuery } from "../../../features/product/ProductAPI";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getTotals } from "../../../features/cart/CartSlice";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { data, error, isLoading } = useGetProductsQuery();

  const auth = useSelector((state) => state.auth);
  console.log(auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    dispatch(getTotals());
  };

  return (
    <div className="home-container">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading products.</p>
      ) : (
        <>
          <h2 className="title">New Arrival</h2>

          <div className="products">
            {data?.map((product) => (
              <div
                key={product._id}
                className="product"
                onClick={() => navigate(`/product/${product._id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-img"
                />

                <h3>{product.name}</h3>

                {/* ⭐ SHORT DESCRIPTION */}
                <p
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                    margin: "4px 0",
                  }}
                >
                  {product.shortDesc || "No description"}
                </p>

                <p className="price">${product.price}</p>

                {/* STOCK */}
                <p>Stock: {product.quantity}</p>

                {/* BUTTON */}
                {product.quantity === 0 ? (
                  <button
                    className="add-btn"
                    disabled
                    style={{
                      background: "#ccc",
                      cursor: "not-allowed",
                    }}
                  >
                    Out of Stock
                  </button>
                ) : (
                  <button
                    className="add-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
