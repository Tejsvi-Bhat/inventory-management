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
      setSuccess("Customer created");
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

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0 }}>Customers</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add Customer</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.full_name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr><td colSpan="4" style={{ textAlign: "center", color: "#94a3b8" }}>No customers yet</td></tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Customer</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
