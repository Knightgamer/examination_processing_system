import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import LoginPage from "./components/pages/LoginPage";
import AdminDashboard from "./components/pages/admin/HomePage";
import StudentDashboard from "./components/pages/students/HomePage";
import LecturerDashboard from "./components/pages/teachers/HomePage";

function App() {
  // const [userRole, setUserRole] = useState(null);
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  useEffect(() => {
    // Listen for changes in localStorage
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem("userRole"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserRole(null);
      return;
    }

    axios
      .get("http://localhost:5000/users/current", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Assuming the response contains the user's role
        setUserRole(response.data.role);
      })
      .catch(() => {
        localStorage.clear();
        setUserRole(null);
      });
  }, []);

  const renderDashboard = () => {
    switch (userRole) {
      case "student":
        return <StudentDashboard />;
      case "lecturer":
        return <LecturerDashboard />;
      case "administrator":
        return <AdminDashboard />;
      default:
        return <Navigate to="/" />;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route path="/home" element={renderDashboard()} />
        <Route path="/lecturer/dashboard" element={renderDashboard()} />
        <Route path="/admin/dashboard" element={renderDashboard()} />

        {/* Catch-all Redirect */}
        <Route path="*" element={renderDashboard()} />
      </Routes>
    </Router>
  );
}

export default App;
