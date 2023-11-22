import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import AdminDashboard from "./components/pages/admin/HomePage";
import StudentDashboard from "./components/pages/students/HomePage";
import LecturerDashboard from "./components/pages/teachers/HomePage";

function App() {
  // State to hold the current user's role
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  // Effect to update the role when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem("userRole"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* <Route path="/register" element={<Register />} /> */}

        {/* Routes for logged-in users */}
        {userRole === "student" && (
          <Route path="/home" element={<StudentDashboard />} />
        )}
        {userRole === "lecturer" && (
          <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
        )}
        {userRole === "administrator" && (
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        )}

        {/* Redirect or Default Route */}
        <Route
          path="*"
          element={
            <Navigate
              to={userRole === "administrator" ? "/admin/dashboard" : "/home"}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
