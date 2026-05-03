import { useGetProductsQuery } from "../../../features/product/ProductAPI";
import { useDispatch } from "react-redux";
import { addToCart, getTotals } from "../../../features/cart/CartSlice";
import { useSelector } from "react-redux";

const Home = () => {
  const { data, error, isLoading } = useGetProductsQuery();

  const auth = useSelector((state) => state.auth);
  console.log(auth);

  const dispatch = useDispatch();

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
              <div key={product._id} className="product">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-img"
                />

                <h3>{product.name}</h3>

                <p className="desc">{product.desc}</p>

                <p className="price">${product.price}</p>

                <button
                  className="add-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
