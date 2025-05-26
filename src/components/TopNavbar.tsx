// components/TopNavbar.tsx
import React from "react";
import { Link } from "react-router-dom";

const TopNavbar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top mb-4 shadow">
      <div className="container">
        <Link className="navbar-brand" to="/">Expense Tracker</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/transactions">Transactions</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/report">Monthly Report</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
