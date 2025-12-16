import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./mainMaster.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function MainMaster() {
  const location = useLocation();

  return (
    <div className="app-layout">
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">

        {/* BRAND CARD */}
        <div className="brand-card">
          <div className="brand-icon">
            <i className="fas fa-school"></i>
          </div>
          <div className="brand-title">School MGT.</div>
        </div>

        {/* MENU */}
        <nav className="menu">
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
          >
            <i className="fas fa-home"></i>
            Dashboard
          </Link>

          <Link
            to="/fee/dashboard"
            className={location.pathname.startsWith("/fee") ? "active" : ""}
          >
            <i className="fas fa-money-bill-wave"></i>
            Fee
          </Link>

          <Link
            to="/students/dashboard"
            className={location.pathname.startsWith("/students") ? "active" : ""}
          >
            <i className="fas fa-users"></i>
            Students
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
