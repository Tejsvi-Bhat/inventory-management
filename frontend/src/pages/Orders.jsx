import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrders, getCustomers, getProducts, createOrder, deleteOrder } from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ customer_id: "", items: [{ product_id: "", quantity: "" }] });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => {
    getOrders().then((res) => setOrders(res.data)).catch(() => setError("Failed to load orders"));
  };

  useEffect(() => {
    load();
    getCustomers().then((res) => setCustomers(res.data));
    getProducts().then((res) => setProducts(res.data));
  }, []);

  const resetForm = () => {
    setForm({ customer_id: "", items: [{ product_id: "", quantity: "" }] });
    setShowModal(false);
    setError("");
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { product_id: "", quantity: "" }] });
  };

  const removeItem = (index) => {
    const items = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: items.length ? items : [{ product_id: "", quantity: "" }] });
  };

  const updateItem = (index, field, value) => {
    const items = [...form.items];
    items[index] = { ...items[index], [field]: value };
    setForm({ ...form, items });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      customer_id: parseInt(form.customer_id),
      items: form.items.map((item) => ({
        product_id: parseInt(item.product_id),
        quantity: parseInt(item.quantity),
      })),
    };

    try {
      await createOrder(payload);
      setSuccess("Order placed successfully");
      resetForm();
      load();
      getProducts().then((res) => setProducts(res.data));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await deleteOrder(id);
      setSuccess("Order deleted");
      load();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete");
    }
  };

  const customerName = (id) => {
    const c = customers.find((c) => c.id === id);
    return c ? c.full_name : `Customer #${id}`;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p className="page-subtitle">{orders.length} total orders</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create Order</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td><Link to={`/orders/${o.id}`} style={{ fontWeight: 600 }}>#{o.id}</Link></td>
                <td style={{ fontWeight: 500 }}>{customerName(o.customer_id)}</td>
                <td><span className="badge badge-info">{o.items.length} item{o.items.length !== 1 ? "s" : ""}</span></td>
                <td style={{ fontWeight: 600 }}>${o.total_amount.toFixed(2)}</td>
                <td style={{ color: "#64748b" }}>{new Date(o.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="actions-cell">
                    <Link to={`/orders/${o.id}`} className="btn btn-ghost btn-sm">View</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(o.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6">
                  <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <p>No orders yet. Create your first order to get started.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create Order</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Customer</label>
                <select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} required>
                  <option value="">Select a customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.full_name}</option>
                  ))}
                </select>
              </div>

              <label style={{ fontWeight: 600, fontSize: "0.8rem", color: "#374151", display: "block", marginBottom: "0.5rem" }}>Order Items</label>
              {form.items.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "end" }}>
                  <div className="form-group" style={{ flex: 2, margin: 0 }}>
                    <select value={item.product_id} onChange={(e) => updateItem(i, "product_id", e.target.value)} required>
                      <option value="">Select product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.quantity_in_stock} in stock)</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1, margin: 0 }}>
                    <input type="number" min="1" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(i, "quantity", e.target.value)} required />
                  </div>
                  {form.items.length > 1 && (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeItem(i)} style={{ color: "#ef4444" }}>✕</button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-secondary" style={{ marginTop: "0.25rem", fontSize: "0.8rem" }} onClick={addItem}>+ Add another item</button>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn btn-primary">Place Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
