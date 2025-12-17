import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./StudentForm.css";

const StudentForm = ({ studentId }) => {
  const [activeTab, setActiveTab] = useState("academic");
  const [isEdit, setIsEdit] = useState(false);

  const [student, setStudent] = useState({
    admissionNo: "",
    studentName: "",
    gender: "",
    dob: "",
    sessionOfAdmission: "2024-25",
    aadhaarNo: "",
    email: "",
    phone: "",
    category: "",
    addressPresent: "",
    addressPermanent: "",
    district: "",
    state: "",
    pincode: "",
    fathersName: "",
    fathersQualification: "",
    fathersJob: "",
    fathersPhone: "",
    fathersAadhaar: "",
    fathersEmail: "",
    mothersName: "",
    mothersQualification: "",
    mothersJob: "",
    mothersPhone: "",
    mothersAadhaar: "",
    mothersEmail: "",
  });

  const [studentInfo, setStudentInfo] = useState({
    current_Session: "2024-25",
    sessionID: 1,
    classID: "",
    sectionID: "",
    rollNo: "",
    route: "",
    busStop: "",
  });

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [busStops, setBusStops] = useState([]);

  const [photos, setPhotos] = useState({
    studentPhoto: null,
    fatherPhoto: null,
    motherPhoto: null,
  });

  const [preview, setPreview] = useState({
    studentPhoto: "",
    fatherPhoto: "",
    motherPhoto: "",
  });

  const cache = useRef({
    classes: null,
    sections: {},
    routes: null,
    busStops: {},
  });

  /* ================= LOAD INITIAL ================= */
  const loadStudent = useCallback(async (id) => {
    try {
      const res = await axios.get(`http://localhost:5161/api/student/${id}`);
      setStudent(res.data.student);
      setStudentInfo(res.data.studentInfo);
      setPreview({
        studentPhoto: res.data.studentPhoto,
        fatherPhoto: res.data.fatherPhoto,
        motherPhoto: res.data.motherPhoto,
      });
    } catch {
      toast.error("Failed to load student details");
    }
  }, []);

  useEffect(() => {
    loadClasses();
    loadRoutes();
    if (studentId) {
      setIsEdit(true);
      loadStudent(studentId);
    }
  }, [studentId, loadStudent]);

  /* ================= API ================= */
  const loadClasses = async () => {
    if (cache.current.classes) {
      setClasses(cache.current.classes);
      return;
    }
    try {
      const res = await axios.get("http://localhost:5161/api/classes?session=2024-25");
      setClasses(res.data);
      cache.current.classes = res.data;
    } catch {
      toast.error("Failed to load classes");
    }
  };

  const loadSections = async (classId) => {
    if (!classId) return;
    if (cache.current.sections[classId]) {
      setSections(cache.current.sections[classId]);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5161/api/sections?classid=${classId}`);
      setSections(res.data);
      cache.current.sections[classId] = res.data;
    } catch {
      toast.error("Failed to load sections");
    }
  };

  const loadRoutes = async () => {
    if (cache.current.routes) {
      setRoutes(cache.current.routes);
      return;
    }
    try {
      const res = await axios.get("http://localhost:5161/api/transport/routes");
      setRoutes(res.data);
      cache.current.routes = res.data;
    } catch {
      toast.error("Failed to load routes");
    }
  };

  const loadBusStops = async (routeId) => {
    if (!routeId) return;
    if (cache.current.busStops[routeId]) {
      setBusStops(cache.current.busStops[routeId]);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5161/api/busstops/byroute/${routeId}`);
      setBusStops(res.data);
      cache.current.busStops[routeId] = res.data;
    } catch {
      toast.error("Failed to load bus stops");
    }
  };

  /* ================= HANDLERS ================= */
  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo({ ...studentInfo, [name]: value });

    if (name === "route") {
      loadBusStops(value);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotos({ ...photos, [e.target.name]: file });
    setPreview({ ...preview, [e.target.name]: URL.createObjectURL(file) });
  };

  /* ================= VALIDATION ================= */
  const validateTab = (tab) => {
    if (tab === "student") {
      if (!student.studentName || !student.admissionNo) {
        toast.error("Student name & Admission No required");
        return false;
      }
    }
    if (tab === "academic") {
      if (!studentInfo.classID || !studentInfo.sectionID) {
        toast.error("Class & Section required");
        return false;
      }
    }
    if (tab === "father" && !student.fathersName) {
      toast.error("Father name required");
      return false;
    }
    if (tab === "mother" && !student.mothersName) {
      toast.error("Mother name required");
      return false;
    }
    return true;
  };

  const handleTabChange = (tab) => {
    if (!validateTab(activeTab)) return;
    setActiveTab(tab);
  };

  const validateAll = () => {
    return ["academic", "student", "address", "father", "mother"].every(validateTab);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    const formData = new FormData();
    formData.append("student", JSON.stringify(student));
    formData.append("studentInfo", JSON.stringify(studentInfo));
    Object.keys(photos).forEach((p) => photos[p] && formData.append(p, photos[p]));

    const transactionId = Date.now();
    formData.append("transactionId", transactionId);

    try {
      if (isEdit) {
        await axios.put(`http://localhost:5161/api/student/update/${studentId}`, formData);
        toast.success("Student updated successfully");
      } else {
        await axios.post("http://localhost:5161/api/student/insert", formData);
        toast.success("Student added successfully");
      }
    } catch {
      toast.error("Operation failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" />
      <div className="card shadow card-modern">
        <div className="card-header bg-gradient-primary text-white">
          <h4>{isEdit ? "Edit Student" : "Student Admission Form"}</h4>
        </div>

        <div className="card-body">
          <ul className="nav nav-tabs mb-4">
            {["academic", "student", "address", "father", "mother"].map((t) => (
              <li className="nav-item" key={t}>
                <button
                  type="button"
                  className={`nav-link ${activeTab === t ? "active" : ""}`}
                  onClick={() => handleTabChange(t)}
                >
                  {t.toUpperCase()}
                </button>
              </li>
            ))}
          </ul>

          <form onSubmit={handleSubmit}>
            {/* ===== ACADEMIC ===== */}
            {activeTab === "academic" && (
              <div className="row g-3">
                <div className="col-md-3">
                  <label>Class</label>
                  <select
                    className="form-select"
                    name="classID"
                    value={studentInfo.classID}
                    onChange={(e) => {
                      handleInfoChange(e);
                      loadSections(e.target.value);
                    }}
                  >
                    <option value="">Select</option>
                    {classes.map((c) => (
                      <option key={c.classID} value={c.classID}>
                        {c.className}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label>Section</label>
                  <select
                    className="form-select"
                    name="sectionID"
                    value={studentInfo.sectionID}
                    onChange={handleInfoChange}
                  >
                    <option value="">Select</option>
                    {sections.map((s) => (
                      <option key={s.sectionID} value={s.sectionID}>
                        {s.sectionName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label>Roll No</label>
                  <input
                    className="form-control"
                    name="rollNo"
                    value={studentInfo.rollNo}
                    onChange={handleInfoChange}
                  />
                </div>

                <div className="col-md-3">
                  <label>Route</label>
                  <select
                    className="form-select"
                    name="route"
                    value={studentInfo.route}
                    onChange={handleInfoChange}
                  >
                    <option value="">Select Route</option>
                    {routes.map((r) => (
                      <option key={r.routeID} value={r.routeID}>
                        {r.routeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label>Bus Stop</label>
                  <select
                    className="form-select"
                    name="busStop"
                    value={studentInfo.busStop}
                    onChange={handleInfoChange}
                  >
                    <option value="">Select Bus Stop</option>
                    {busStops.map((b) => (
                      <option key={b.busStopID} value={b.busStopName}>
                        {b.busStopName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* ===== OTHER TABS ===== */}
            {activeTab === "student" && (
              <div className="row g-3">
                <div className="col-md-3">
                  <label>Name</label>
                  <input
                    name="studentName"
                    className="form-control"
                    value={student.studentName}
                    onChange={handleStudentChange}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label>Gender</label>
                  <select
                    name="gender"
                    className="form-select"
                    value={student.gender}
                    onChange={handleStudentChange}
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label>Admission No</label>
                  <input
                    name="admissionNo"
                    className="form-control"
                    value={student.admissionNo}
                    onChange={handleStudentChange}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label>DOB</label>
                  <input
                    type="date"
                    name="dob"
                    className="form-control"
                    value={student.dob}
                    onChange={handleStudentChange}
                  />
                </div>
              </div>
            )}

            {activeTab === "address" && (
              <div className="row g-3">
                <div className="col-md-3">
                  <label>Present Address</label>
                  <input
                    name="addressPresent"
                    className="form-control"
                    value={student.addressPresent}
                    onChange={handleStudentChange}
                  />
                </div>
                <div className="col-md-3">
                  <label>Permanent Address</label>
                  <input
                    name="addressPermanent"
                    className="form-control"
                    value={student.addressPermanent}
                    onChange={handleStudentChange}
                  />
                </div>
              </div>
            )}

            {activeTab === "father" && (
              <div className="row g-3">
                <div className="col-md-3">
                  <label>Name</label>
                  <input
                    name="fathersName"
                    className="form-control"
                    value={student.fathersName}
                    onChange={handleStudentChange}
                  />
                </div>
                <div className="col-md-3">
                  <label>Qualification</label>
                  <input
                    name="fathersQualification"
                    className="form-control"
                    value={student.fathersQualification}
                    onChange={handleStudentChange}
                  />
                </div>
              </div>
            )}

            {activeTab === "mother" && (
              <div className="row g-3">
                <div className="col-md-3">
                  <label>Name</label>
                  <input
                    name="mothersName"
                    className="form-control"
                    value={student.mothersName}
                    onChange={handleStudentChange}
                  />
                </div>
              </div>
            )}

            <div className="text-end mt-4">
              <button
                className="btn btn-secondary me-2"
                type="button"
                onClick={() => window.print()}
              >
                Print Preview
              </button>
              <button className="btn btn-success px-5" type="submit">
                {isEdit ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
