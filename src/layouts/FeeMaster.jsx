import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./feeMaster.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function FeeMaster() {
  const location = useLocation();

  return (
    <div className="app-layout">
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">

        {/* BRAND CARD */}
        <div className="brand-card">
          <div className="brand-icon">
            <i className="fas fa-wallet"></i>
          </div>
          <div className="brand-title">Fee</div>
        </div>

        {/* MENU */}
        <nav className="menu">
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
          >
            <i className="fas fa-tachometer-alt"></i>
            Dashboard
          </Link>

          <Link
            to="/fee/collection"
            className={location.pathname.startsWith("/fee/collection") ? "active" : ""}
          >
            <i className="fas fa-coins"></i>
            Fee Collection
          </Link>

          <Link
            to="/fee/reports"
            className={location.pathname.startsWith("/fee/reports") ? "active" : ""}
          >
            <i className="fas fa-file-invoice-dollar"></i>
            Fee Reports
          </Link>
        </nav>
      </aside>

      {/* ===== CONTENT ===== */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
