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
        setSuccess("Product updated");
      } else {
        await createProduct(payload);
        setSuccess("Product created");
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0 }}>Products</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add Product</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>${p.price.toFixed(2)}</td>
              <td>
                {p.quantity_in_stock}
                {p.quantity_in_stock < 10 && <span className="badge-warning" style={{ marginLeft: 6 }}>Low</span>}
              </td>
              <td>
                <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(p)} style={{ marginRight: 4 }}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr><td colSpan="5" style={{ textAlign: "center", color: "#94a3b8" }}>No products yet</td></tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>SKU / Code</label>
                <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price</label>
                  <input type="number" step="0.01" min="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Quantity in Stock</label>
                  <input type="number" min="0" value={form.quantity_in_stock} onChange={(e) => setForm({ ...form, quantity_in_stock: e.target.value })} required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
