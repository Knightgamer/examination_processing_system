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

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the user's data from local storage/session storage or global state
    // This is a placeholder, replace it with actual logic to retrieve user data
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUser(userData);
  }, []);

  // Redirect based on user role
  const PrivateRoute = ({ children, role }) => {
    if (!user) {
      // If no user data is available, redirect to login
      return <Navigate to="/login" />;
    } else if (user.role !== role) {
      // Redirect user to the correct dashboard based on their role
      switch (user.role) {
        case "admin":
          return <Navigate to="/admin" />;
        case "student":
          return <Navigate to="/student" />;
        case "lecturer":
          return <Navigate to="/lecturer" />;
        default:
          return <Navigate to="/login" />;
      }
    }
    return children; // If user has the correct role, render the requested route
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/student"
          element={
            <PrivateRoute role="student">
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/lecturer"
          element={
            <PrivateRoute role="lecturer">
              <LecturerDashboard />
            </PrivateRoute>
          }
        />
        {/* Redirect from root to a specific dashboard or login based on user status */}
        <Route
          path="/"
          element={<Navigate to={user ? `/${user.role}` : "/login"} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
