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
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Overview of your inventory and orders</p>
        </div>
      </div>

      <div className="card-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>Total Products</h3>
            <div className="value">{data.total_products}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>Total Customers</h3>
            <div className="value">{data.total_customers}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <div className="value">{data.total_orders}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>Low Stock Items</h3>
            <div className="value">{data.low_stock_products.length}</div>
          </div>
        </div>
      </div>

      {data.low_stock_products.length > 0 && (
        <>
          <h2 className="section-title">Low Stock Alerts</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Current Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.low_stock_products.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td><code style={{ background: "#f1f5f9", padding: "0.15rem 0.4rem", borderRadius: 4, fontSize: "0.8rem" }}>{p.sku}</code></td>
                    <td style={{ fontWeight: 600 }}>{p.quantity_in_stock}</td>
                    <td>
                      {p.quantity_in_stock <= 3
                        ? <span className="badge badge-warning" style={{ background: "#fef2f2", color: "#ef4444" }}>Critical</span>
                        : <span className="badge badge-warning">Low Stock</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
