import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { url, setHeaders } from "../../../features/api";

const UserOrderDetail = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `${url}/orders/my-orders/${params.id}`,
          setHeaders(),
        );
        setOrder(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, [params.id]);

  if (!order) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      {/* BACK BUTTON */}

      <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        ← Back
      </button>

      {/* ORDER INFO */}

      <h2>Order #{order._id.slice(-8)}</h2>

      <p>
        <b>Total:</b> {order.total?.toLocaleString("vi-VN")}₫
      </p>

      <p>
        <b>Payment:</b> {order.payment_status}
      </p>

      <p>
        <b>Delivery:</b> {order.delivery_status}
      </p>

      {/* CREATED DATE  */}

      <p>
        <b>Created Date:</b>{" "}
        {order.createdAt
          ? new Date(order.createdAt).toLocaleString("en-GB")
          : "—"}
      </p>

      {/* SHIPPING INFO */}

      <h3 style={{ marginTop: "1.5rem" }}>Shipping Info</h3>

      <p>
        <b>Name:</b> {order.shipping?.name}
      </p>

      <p>
        <b>Email:</b> {order.shipping?.email}
      </p>

      <p>
        <b>Phone:</b> {order.shipping?.phone}
      </p>

      {/* ADDRESS */}

      <p>
        <b>Address:</b>
      </p>

      <div>{order.shipping?.address?.line1}</div>

      {order.shipping?.address?.line2 && (
        <div>{order.shipping?.address?.line2}</div>
      )}

      <p>
        <b>City:</b> {order.shipping?.address?.city}
      </p>

      <p>
        <b>Country:</b> {order.shipping?.address?.country}
      </p>

      {/* PRODUCTS */}

      <h3 style={{ marginTop: "1.5rem" }}>Products</h3>

      {order.products?.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "0.8rem",
            border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <img
            src={Array.isArray(item.image) ? item.image[0] : item.image}
            alt={item.name}
            width="60"
            height="60"
            style={{ objectFit: "cover" }}
          />

          <div>
            <p>
              <b>{item.name}</b>
            </p>

            <p>Qty: {item.cartQuantity}</p>

            <p>
              Price:{" "}
              {item.isDiscount && item.discountPercent > 0
                ? (
                    item.price *
                    (1 - item.discountPercent / 100)
                  ).toLocaleString("vi-VN")
                : item.price?.toLocaleString("vi-VN")}
              ₫
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserOrderDetail;
