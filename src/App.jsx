import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import NavMenu from './components/NavMenu.jsx';

export default function App() {
  return (
    <div className="container">
      <header className="header">
        <div className="brand" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link to="/">
            <img src="images/SCPlogo.png" alt="SCP Foundation Logo" style={{ height: "150px", width: "auto" }} />
          </Link>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <span>SCP FOUNDATION</span>
          </Link>
        </div>
        <nav className="nav">
          <Link className="link" to="admin">Admin</Link>
        </nav>
      </header>
      <div className="grid grid-cols-2">
        <div className="card">
          <NavMenu />
        </div>
        <div className="card">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
