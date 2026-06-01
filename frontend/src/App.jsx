import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="sidebar">
          <h2>Inventory Manager</h2>
          <ul>
            <li><NavLink to="/">Dashboard</NavLink></li>
            <li><NavLink to="/products">Products</NavLink></li>
            <li><NavLink to="/customers">Customers</NavLink></li>
            <li><NavLink to="/orders">Orders</NavLink></li>
          </ul>
        </nav>
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
