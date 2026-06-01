import { useState, useEffect } from "react";
import { getDashboard } from "../services/api";

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load dashboard data"));
  }, []);

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="card-grid">
        <div className="card">
          <h3>Total Products</h3>
          <div className="value">{data.total_products}</div>
        </div>
        <div className="card">
          <h3>Total Customers</h3>
          <div className="value">{data.total_customers}</div>
        </div>
        <div className="card">
          <h3>Total Orders</h3>
          <div className="value">{data.total_orders}</div>
        </div>
        <div className="card">
          <h3>Low Stock Items</h3>
          <div className="value">{data.low_stock_products.length}</div>
        </div>
      </div>

      {data.low_stock_products.length > 0 && (
        <>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Low Stock Products</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {data.low_stock_products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td><span className="badge-warning">{p.quantity_in_stock}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Dashboard;
