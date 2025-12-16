import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./studentDashboard.css"; // Create this file for modern styles

export default function StudentDashboard() {
  const [showModal, setShowModal] = useState(false);

  const totalStudents = 120;
  const boys = 70;
  const girls = 50;

  return (
    <div className="dashboard-container">
      

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="icon-box">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <div className="stat-title">Total Students</div>
            <div className="stat-value">{totalStudents}</div>
          </div>
        </div>

        <div className="stat-card green">
          <div className="icon-box">
            <i className="fas fa-male"></i>
          </div>
          <div className="stat-info">
            <div className="stat-title">Boys</div>
            <div className="stat-value">{boys}</div>
          </div>
        </div>

        <div className="stat-card pink">
          <div className="icon-box">
            <i className="fas fa-female"></i>
          </div>
          <div className="stat-info">
            <div className="stat-title">Girls</div>
            <div className="stat-value">{girls}</div>
          </div>
        </div>
      </div>

      
      

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header blue">
              <h5>Add New Student</h5>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label>Student Name</label>
                  <input type="text" placeholder="Enter name" />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Class</label>
                  <input type="text" placeholder="Enter class" />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              <button className="btn-primary">Save Student</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
