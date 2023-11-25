// App.js
import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import LoginPage from "./components/pages/LoginPage";
import AdminDashboard from "./components/pages/admin/HomePage";
import LecturerDashboard from "./components/pages/lecturer/HomePage";
import StudentDashboard from "./components/pages/student/HomePage";
import { UserRoleProvider } from "./components/UserRoleContext";

const App = () => {
  return (
    <UserRoleProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/lecturer" element={<LecturerDashboard />} />
          <Route
            path="/"
            element={<Navigate to="/login" />} // Redirect to login if no route matches
          />
        </Routes>
      </Router>
    </UserRoleProvider>
  );
};

export default App;
