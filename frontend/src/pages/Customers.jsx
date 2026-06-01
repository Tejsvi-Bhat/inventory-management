import { useState, useEffect } from "react";
import { getCustomers, createCustomer, deleteCustomer } from "../services/api";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => {
    getCustomers().then((res) => setCustomers(res.data)).catch(() => setError("Failed to load customers"));
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ full_name: "", email: "", phone: "" });
    setShowModal(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createCustomer(form);
      setSuccess("Customer created successfully");
      resetForm();
      load();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await deleteCustomer(id);
      setSuccess("Customer deleted");
      load();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete");
    }
  };

  const getInitials = (name) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const colors = ["#3b82f6", "#22c55e", "#a855f7", "#f97316", "#ec4899", "#06b6d4"];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p className="page-subtitle">{customers.length} registered customers</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Customer</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: colors[i % colors.length],
                      color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.7rem", fontWeight: 700, flexShrink: 0
                    }}>
                      {getInitials(c.full_name)}
                    </div>
                    <span style={{ fontWeight: 500 }}>{c.full_name}</span>
                  </div>
                </td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="4">
                  <div className="empty-state">
                    <div className="empty-icon">👤</div>
                    <p>No customers yet. Add your first customer to get started.</p>
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
            <h2>Add Customer</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="e.g. John Smith" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="e.g. john@example.com" required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. +1 555-123-4567" required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
