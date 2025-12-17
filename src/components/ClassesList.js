import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./StudentForm.css"; // Your existing styles

const StudentForm = ({ studentId }) => {
  const [activeTab, setActiveTab] = useState("student");
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
  useEffect(() => {
    const session = studentInfo.current_Session || "2024-25";
    loadClasses(session);
    loadRoutes();
    if (studentId) {
      setIsEdit(true);
      loadStudent(studentId);
    }
  }, [studentId]);

  /* ================= API ================= */
  const loadClasses = async (session) => {
    if (cache.current.classes) {
      setClasses(cache.current.classes);
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:5161/api/classes?session=${encodeURIComponent(session)}`
      );
      setClasses(res.data);
      cache.current.classes = res.data;
    } catch (err) {
      console.error(err);
      toast.error("Failed to load classes");
    }
  };

  const loadSections = async (classID) => {
    const session = studentInfo.current_Session || "2024-25";
    if (cache.current.sections[classID]) {
      setSections(cache.current.sections[classID]);
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:5161/api/sections/byclass/${classID}?session=${encodeURIComponent(session)}`
      );
      setSections(res.data);
      cache.current.sections[classID] = res.data;
    } catch (err) {
      console.error(err);
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
    if (cache.current.busStops[routeId]) {
      setBusStops(cache.current.busStops[routeId]);
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:5161/api/transport/busstops?routeId=${routeId}`
      );
      setBusStops(res.data);
      cache.current.busStops[routeId] = res.data;
    } catch {
      toast.error("Failed to load bus stops");
    }
  };

  const loadStudent = async (id) => {
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
  };

  /* ================= HANDLERS ================= */
  const handleStudentChange = (e) =>
    setStudent({ ...student, [e.target.name]: e.target.value });

  const handleInfoChange = async (e) => {
    const { name, value } = e.target;
    setStudentInfo({ ...studentInfo, [name]: value });

    if (name === "classID") {
      setStudentInfo((prev) => ({ ...prev, sectionID: "" }));
      await loadSections(value);
    }

    if (name === "sectionID") {
      try {
        const res = await axios.get(
          `http://localhost:5161/api/student/next-rollno?classId=${studentInfo.classID}&sectionId=${value}`
        );
        setStudentInfo((prev) => ({ ...prev, rollNo: res.data }));
      } catch {
        toast.error("Failed to generate Roll No");
      }
    }

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
    if (tab === "father") {
      if (!student.fathersName) {
        toast.error("Father name required");
        return false;
      }
    }
    if (tab === "mother") {
      if (!student.mothersName) {
        toast.error("Mother name required");
        return false;
      }
    }
    return true;
  };

  const handleTabChange = (tab) => {
    if (!validateTab(activeTab)) return;
    setActiveTab(tab);
  };

  const validateAll = () =>
    ["student", "academic", "father", "mother"].every(validateTab);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    const formData = new FormData();
    formData.append("student", JSON.stringify(student));
    formData.append("studentInfo", JSON.stringify(studentInfo));
    Object.keys(photos).forEach(
      (p) => photos[p] && formData.append(p, photos[p])
    );
    const transactionId = Date.now();
    formData.append("transactionId", transactionId);

    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:5161/api/student/update/${studentId}`,
          formData
        );
        toast.success("Student updated successfully");
      } else {
        await axios.post(
          "http://localhost:5161/api/student/insert",
          formData
        );
        toast.success("Student added successfully");
      }
    } catch {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" />
      <div className="card shadow card-modern">
        <div className="card-header bg-gradient-primary text-white">
          <h4>{isEdit ? "Edit Student" : "Student Admission Form"}</h4>
        </div>

        <div className="card-body">
          <ul className="nav nav-tabs mb-4">
            {["student", "academic", "address", "father", "mother"].map((t) => (
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
            {/* STUDENT, ACADEMIC, ADDRESS, FATHER, MOTHER sections remain same */}
            {/* ... Keep your existing JSX unchanged ... */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
