import { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", sku: "", price: "", quantity_in_stock: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => {
    getProducts().then((res) => setProducts(res.data)).catch(() => setError("Failed to load products"));
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ name: "", sku: "", price: "", quantity_in_stock: "" });
    setEditing(null);
    setShowModal(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      name: form.name,
      sku: form.sku,
      price: parseFloat(form.price),
      quantity_in_stock: parseInt(form.quantity_in_stock),
    };

    try {
      if (editing) {
        await updateProduct(editing.id, payload);
        setSuccess("Product updated successfully");
      } else {
        await createProduct(payload);
        setSuccess("Product created successfully");
      }
      resetForm();
      load();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      sku: product.sku,
      price: product.price.toString(),
      quantity_in_stock: product.quantity_in_stock.toString(),
    });
    setEditing(product);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setSuccess("Product deleted");
      load();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p className="page-subtitle">{products.length} items in inventory</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Product</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500 }}>{p.name}</td>
                <td><code style={{ background: "#f1f5f9", padding: "0.15rem 0.4rem", borderRadius: 4, fontSize: "0.8rem" }}>{p.sku}</code></td>
                <td>${p.price.toFixed(2)}</td>
                <td>
                  <div className="stock-cell">
                    {p.quantity_in_stock}
                    {p.quantity_in_stock < 10 && <span className="badge badge-warning">Low</span>}
                  </div>
                </td>
                <td>
                  <div className="actions-cell">
                    <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <p>No products yet. Add your first product to get started.</p>
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
            <h2>{editing ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. MacBook Pro 14&quot;" required />
              </div>
              <div className="form-group">
                <label>SKU / Code</label>
                <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="e.g. MBP-14-M3" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input type="number" step="0.01" min="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" required />
                </div>
                <div className="form-group">
                  <label>Quantity in Stock</label>
                  <input type="number" min="0" value={form.quantity_in_stock} onChange={(e) => setForm({ ...form, quantity_in_stock: e.target.value })} placeholder="0" required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? "Save Changes" : "Add Product"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
