import React, { useEffect, useState } from "react";
import API from "../api";


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/orders/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Orders fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p style={{ padding: "40px" }}>Loading orders...</p>;
  }

  return (
    <div className="orders-page">
      {/* ===== INLINE CSS ===== */}
      <style>{`
        .orders-page {
          padding: 40px 8%;
          min-height: 70vh;
          background: #f6f8fb;
        }

        .orders-title {
          font-size: 28px;
          margin-bottom: 30px;
          color: #222;
        }

        .no-orders {
          color: #666;
          font-size: 16px;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .order-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          transition: transform 0.25s ease;
        }

        .order-card:hover {
          transform: translateY(-4px);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          font-size: 14px;
        }

        .order-id {
          font-weight: 600;
          color: #444;
        }

        .status {
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 13px;
          text-transform: capitalize;
        }

        .status.completed {
          background: #e6fff1;
          color: #0f9d58;
        }

        .status.pending {
          background: #fff4e5;
          color: #d97706;
        }

        .order-items {
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
          padding: 12px 0;
          margin: 10px 0;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          font-size: 15px;
          margin-bottom: 6px;
          color: #333;
        }

        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          font-weight: 600;
        }

        .order-total {
          color: #007bff;
        }

        .order-date {
          font-size: 13px;
          color: #777;
        }

        @media (max-width: 768px) {
          .orders-page {
            padding: 30px 16px;
          }

          .order-item {
            font-size: 14px;
          }
        }
      `}</style>

      <h2 className="orders-title">My Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">You have not placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span className="order-id">
                  Order ID: {order._id}
                </span>
                <span className={`status ${order.paymentStatus}`}>
                  {order.paymentStatus}
                </span>
              </div>

              <div className="order-items">
                {order.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <span className="order-total">
                  Total: ₹{order.totalAmount}
                </span>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
