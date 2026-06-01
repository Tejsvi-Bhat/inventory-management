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
    getOrder(id)
      .then((res) => {
        setOrder(res.data);
        return Promise.all([
          getProducts(),
          getCustomers(),
        ]);
      })
      .then(([prodRes, custRes]) => {
        const prodMap = {};
        prodRes.data.forEach((p) => { prodMap[p.id] = p; });
        setProducts(prodMap);

        const c = custRes.data.find((c) => c.id === order?.customer_id);
        // order might not be set yet, we'll handle in render
        setCustomer(null);
        // re-derive after order is set
        const custMap = {};
        custRes.data.forEach((c) => { custMap[c.id] = c; });
        setCustomer(custMap);
      })
      .catch(() => setError("Failed to load order details"));
  }, [id]);

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!order) return <p>Loading...</p>;

  const cust = customer?.[order.customer_id];

  return (
    <div>
      <Link to="/orders" style={{ color: "#3b82f6", textDecoration: "none", fontSize: "0.9rem" }}>&larr; Back to Orders</Link>
      <h1 style={{ marginTop: "0.75rem" }}>Order #{order.id}</h1>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <p><strong>Customer:</strong> {cust ? cust.full_name : `#${order.customer_id}`}</p>
        <p><strong>Email:</strong> {cust?.email || "N/A"}</p>
        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
        <p><strong>Total:</strong> ${order.total_amount.toFixed(2)}</p>
      </div>

      <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Items</h2>
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
              <td>{products[item.product_id]?.name || `Product #${item.product_id}`}</td>
              <td>{item.quantity}</td>
              <td>${item.unit_price.toFixed(2)}</td>
              <td>${(item.quantity * item.unit_price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderDetails;
