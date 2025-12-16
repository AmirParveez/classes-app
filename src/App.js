import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainMaster from "./layouts/MainMaster";
import FeeMaster from "./layouts/FeeMaster";
import StudentMaster from "./layouts/StudentMaster";

import Dashboard from "./pages/Dashboard";
import FeeDashboard from "./pages/fee/FeeDashboard";
import StudentDashboard from "./pages/students/StudentDashboard";
import ClassesList from "./components/ClassesList";
import StudentForm from "./components/StudentForm";
import Login from "./Login";

import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <Router>
      <Routes>

        {/* 🔐 LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* 🔒 MAIN DASHBOARD */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <MainMaster />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>

        {/* 🔒 FEE SECTION */}
        <Route
          path="/fee"
          element={
            <RequireAuth>
              <FeeMaster />
            </RequireAuth>
          }
        >
          <Route index element={<FeeDashboard />} />
        </Route>

        {/* 🔒 STUDENTS SECTION */}
        <Route
          path="/students"
          element={
            <RequireAuth>
              <StudentMaster />
            </RequireAuth>
          }
        >
          {/* ✅ DEFAULT */}
          <Route index element={<StudentDashboard />} />

          {/* OPTIONAL DASHBOARD PATH */}
          <Route path="dashboard" element={<StudentDashboard />} />

          {/* STUDENT LIST */}
          <Route path="list" element={<ClassesList />} />

          {/* ADD STUDENT */}
          <Route path="add" element={<StudentForm />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
