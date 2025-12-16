import React, { useEffect, useState } from "react";
import axios from "axios";
import "./classlist.css";
import "bootstrap/dist/css/bootstrap.min.css";

const ClassSectionDropdown = () => {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("studentName");
  const [sortOrder, setSortOrder] = useState("asc");

  const session = "2024-25";

  useEffect(() => {
    axios
      .get(`http://localhost:5161/api/classes?session=${session}`)
      .then((res) => setClasses(res.data))
      .catch((err) => console.error("Error fetching classes:", err));
  }, []);

  useEffect(() => {
    if (!selectedClass) {
      setSections([]);
      setSelectedSection("");
      return;
    }

    axios
      .get(`http://localhost:5161/api/sections?classid=${selectedClass}`)
      .then((res) => setSections(res.data))
      .catch((err) => console.error("Error fetching sections:", err));
  }, [selectedClass]);

  const handleGetStudents = () => {
    if (!selectedClass || !selectedSection) {
      alert("Please select both class and section");
      return;
    }

    axios
      .get(
        `http://localhost:5161/api/students?classId=${selectedClass}&sectionId=${selectedSection}`
      )
      .then((res) => setStudents(res.data))
      .catch(() => setStudents([]));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredStudents = students
    .filter(
      (stu) =>
        stu.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stu.phoneNo.includes(searchTerm)
    )
    .sort((a, b) => {
      const aVal = a[sortField]?.toLowerCase();
      const bVal = b[sortField]?.toLowerCase();
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="container mt-4">
      <div className="card card-modern">
        {/* Header */}
        <div className="card-header bg-gradient-primary">
          <h4 className="mb-0 fw-bold">Student List</h4>
        </div>

        {/* Body */}
        <div className="card-body bg-white">
          {/* Filters */}
          <div className="row g-3 mb-4 align-items-end">
            <div className="col-md-3">
              <label className="form-label fw-bold">Class</label>
              <select
                className="form-select"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.classID} value={cls.classID}>
                    {cls.className}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">Section</label>
              <select
                className="form-select"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                disabled={!selectedClass}
              >
                <option value="">Select Section</option>
                {sections.map((sec) => (
                  <option key={sec.sectionID} value={sec.sectionID}>
                    {sec.sectionName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3 d-flex">
              <button
                className="btn btn-success w-100 btn-modern"
                onClick={handleGetStudents}
              >
                Get Students
              </button>
            </div>
          </div>

          {/* Search */}
          {students.length > 0 && (
            <input
              type="text"
              className="form-control mb-3 search-box"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}

          {/* Table */}
          {students.length > 0 && (
            <div className="table-responsive">
              <table className="table table-hover table-bordered modern-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("studentName")}>
                      Student Name{" "}
                      {sortField === "studentName" &&
                        (sortOrder === "asc" ? "▲" : "▼")}
                    </th>
                    <th onClick={() => handleSort("phoneNo")}>
                      Phone No{" "}
                      {sortField === "phoneNo" &&
                        (sortOrder === "asc" ? "▲" : "▼")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((stu, index) => (
                    <tr key={index}>
                      <td>{stu.studentName}</td>
                      <td>{stu.phoneNo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassSectionDropdown;
