import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./studentMaster.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function StudentMaster() {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="app-layout">
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">

        {/* BRAND */}
        <div className="brand-card">
          <div className="brand-icon">
            <i className="fas fa-user-graduate"></i>
          </div>
          <div className="brand-title">Students</div>
        </div>

        {/* MENU */}
        <nav className="menu">

          {/* ✅ MAIN DASHBOARD */}
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
          >
            <i className="fas fa-home"></i>
            Dashboard
          </Link>

          {/* STUDENT DASHBOARD */}
          

          {/* ADD STUDENT */}
          <Link
            to="/students/add"
            className={isActive("/students/add") ? "active" : ""}
          >
            <i className="fas fa-user-plus"></i>
            Add Student
          </Link>

          {/* STUDENT LIST */}
          <Link
            to="/students/list"
            className={isActive("/students/list") ? "active" : ""}
          >
            <i className="fas fa-list"></i>
            Student List
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
