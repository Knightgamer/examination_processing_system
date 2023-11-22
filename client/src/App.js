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
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to check if the user is authenticated (has a valid token)
  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    return !!token; // Convert to boolean: true if token exists, false otherwise
  };

  useEffect(() => {
    setIsAuthenticated(checkAuthentication());

    const handleStorageChange = () => {
      setUserRole(localStorage.getItem("userRole"));
      setIsAuthenticated(checkAuthentication());
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

        {/* Protected Routes for logged-in users */}
        {isAuthenticated && userRole === "student" && (
          <Route path="/home" element={<StudentDashboard />} />
        )}
        {isAuthenticated && userRole === "lecturer" && (
          <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
        )}
        {isAuthenticated && userRole === "administrator" && (
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        )}

        {/* Redirect to Login or Appropriate Dashboard based on Authentication and Role */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate
                to={userRole === "administrator" ? "/admin/dashboard" : "/home"}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
