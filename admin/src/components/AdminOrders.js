import React, { useEffect, useState } from "react";

const API =
  (process.env.REACT_APP_API_BASE || "http://localhost:5000/api");

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Admin orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, );

  const updateStatus = async (orderId, status) => {
    try {
      await fetch(`${API}/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      fetchOrders(); // refresh list
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  if (loading) {
    return <p style={{ padding: "40px" }}>Loading orders...</p>;
  }

  return (
    <div className="admin-orders">
      <style>{`
        .admin-orders {
          padding: 40px 8%;
          background: #f5f7fb;
          min-height: 80vh;
        }

        h2 {
          margin-bottom: 30px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }

        th, td {
          padding: 14px;
          text-align: left;
          font-size: 14px;
        }

        th {
          background: #007bff;
          color: white;
        }

        tr:nth-child(even) {
          background: #f9f9f9;
        }

        select {
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          cursor: pointer;
        }

        .pending { color: #d97706; }
        .completed { color: #0f9d58; }
        .cancelled { color: #dc2626; }

        @media (max-width: 900px) {
          table { font-size: 12px; }
        }
      `}</style>

      <h2>Admin — Orders Management</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Change Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>

                <td>
                  {order.user?.name || "User"}
                  <br />
                  <small>{order.user?.email}</small>
                </td>

                <td>
                  {order.items.map((item, i) => (
                    <div key={i}>
                      {item.name} × {item.quantity}
                    </div>
                  ))}
                </td>

                <td>₹{order.totalAmount}</td>

                <td className={order.paymentStatus}>
                  {order.paymentStatus}
                </td>

                <td>
                  <select
                    value={order.paymentStatus}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;
