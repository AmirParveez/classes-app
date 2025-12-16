import React from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const totalStudents = 120;
  const boysRoll = 70;
  const girlsRoll = 50;

  const userName =
    localStorage.getItem("userName") &&
    localStorage.getItem("userName") !== "undefined"
      ? localStorage.getItem("userName")
      : "Admin";

  const session = "2024–25";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* ===== TOP BAR ===== */}
      <div className="topbar">
        <div className="session">Session {session}</div>

        <div className="user-box" onClick={handleLogout} title="Logout">
          <div className="avatar">{userName.charAt(0)}</div>
          <span style={{ fontSize: 14, fontWeight: 500 }}>{userName}</span>
          <i className="fas fa-sign-out-alt" style={{ fontSize: 14 }}></i>
        </div>
      </div>

      {/* ===== DASHBOARD ===== */}
      <div className="dashboard">
        <div className="stats">

          <div className="stat-card">
            <div className="icon-box blue">
              <i className="fas fa-users"></i>
            </div>
            <div>
              <div className="stat-title">Total Students</div>
              <div className="stat-value">{totalStudents}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon-box green">
              <i className="fas fa-male"></i>
            </div>
            <div>
              <div className="stat-title">Boys</div>
              <div className="stat-value">{boysRoll}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon-box pink">
              <i className="fas fa-female"></i>
            </div>
            <div>
              <div className="stat-title">Girls</div>
              <div className="stat-value">{girlsRoll}</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
