import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrder, getProducts, getCustomers } from "../services/api";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState({});
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getOrder(id), getProducts(), getCustomers()])
      .then(([orderRes, prodRes, custRes]) => {
        setOrder(orderRes.data);

        const prodMap = {};
        prodRes.data.forEach((p) => { prodMap[p.id] = p; });
        setProducts(prodMap);

        const c = custRes.data.find((c) => c.id === orderRes.data.customer_id);
        setCustomer(c || null);
      })
      .catch(() => setError("Failed to load order details"));
  }, [id]);

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <Link to="/orders" className="back-link">&larr; Back to Orders</Link>

      <div className="page-header">
        <div>
          <h1>Order #{order.id}</h1>
          <p className="page-subtitle">Placed on {new Date(order.created_at).toLocaleString()}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>Total Amount</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a" }}>${order.total_amount.toFixed(2)}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Customer</label>
            <span>{customer ? customer.full_name : `#${order.customer_id}`}</span>
          </div>
          <div className="detail-item">
            <label>Email</label>
            <span>{customer?.email || "N/A"}</span>
          </div>
          <div className="detail-item">
            <label>Phone</label>
            <span>{customer?.phone || "N/A"}</span>
          </div>
          <div className="detail-item">
            <label>Order Date</label>
            <span>{new Date(order.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <h2 className="section-title">Order Items</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 500 }}>{products[item.product_id]?.name || `Product #${item.product_id}`}</td>
                <td>{item.quantity}</td>
                <td>${item.unit_price.toFixed(2)}</td>
                <td style={{ fontWeight: 600 }}>${(item.quantity * item.unit_price).toFixed(2)}</td>
              </tr>
            ))}
            <tr style={{ background: "#f8fafc" }}>
              <td colSpan="3" style={{ textAlign: "right", fontWeight: 600, color: "#64748b" }}>Total</td>
              <td style={{ fontWeight: 700, fontSize: "1rem" }}>${order.total_amount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderDetails;
