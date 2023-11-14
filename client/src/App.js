import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import AdministratorHomePage from "./components/pages/admin/HomePage";
import StudentHomePage from "./components/pages/students/HomePage";
import LecturerHomePage from "./components/pages/teachers/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/student/home" element={<StudentHomePage />} />
        <Route path="/lecturer/home" element={<LecturerHomePage />} />
        <Route path="/administrator/home" element={<AdministratorHomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
