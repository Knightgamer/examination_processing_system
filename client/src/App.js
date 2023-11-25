// client\src\App.js
import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { useUserRole } from "./components/UserRoleContext";
import LoginPage from "./components/pages/LoginPage";
import NotFound from "./components/pages/NotFound"; // Import NotFound component
import UnauthorizedAccess from "./components/pages/UnauthorizedAccess";
import AdminDashboard from "./components/pages/admin/HomePage";
import LecturerDashboard from "./components/pages/lecturer/HomePage";
import StudentDashboard from "./components/pages/student/HomePage";

const App = () => {
  const { userRole } = useUserRole();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {userRole === "admin" ? (
          <Route path="/admin" element={<AdminDashboard />} />
        ) : (
          <Route path="/admin" element={<UnauthorizedAccess />} />
        )}
        {userRole === "student" ? (
          <Route path="/student" element={<StudentDashboard />} />
        ) : (
          <Route path="/student" element={<UnauthorizedAccess />} />
        )}
        {userRole === "lecturer" ? (
          <Route path="/lecturer" element={<LecturerDashboard />} />
        ) : (
          <Route path="/lecturer" element={<UnauthorizedAccess />} />
        )}
        <Route path="/*" element={<NotFound />} />{" "}
        {/* Handle 404 Page Not Found */}
        {/* Redirect to login if no route matches */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
