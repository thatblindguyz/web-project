import { useGetProductsQuery } from "../features/productAPI";

const Home = () => {
  const { data, error, isLoading } = useGetProductsQuery();

  return (
    <div className="home-container">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading products.</p>
      ) : (
        <>
          <h2>New Arrival</h2>
          <div className="products">
            {data?.map((product) => (
              <div key={product.id} className="product">
                <h3>{product.name}</h3>

                <img src={`/${product.image}`} alt={product.name} />

                <div className="details">
                  <span>{product.desc}</span>
                  <span className="price">${product.price}</span>
                </div>

                <button>Add to Cart</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
