import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { useUserRole } from "./components/UserRoleContext";
import LoginPage from "./components/pages/LoginPage";
import NotFound from "./components/pages/NotFound";
import UnauthorizedAccess from "./components/pages/UnauthorizedAccess";
import CoursePage from "./components/pages/admin/CoursePage";
import EditMarks from "./components/pages/admin/EditMarks";
import AdminDashboard from "./components/pages/admin/HomePage";
import LecturerPage from "./components/pages/admin/LecturerPage";
import StudentPage from "./components/pages/admin/StudentPage";
import LecturerDashboard from "./components/pages/lecturer/HomePage";
import LecturerCourses from "./components/pages/lecturer/LecturerCourses";
import CourseRegistration from "./components/pages/student/CourseRegistration";
import StudentDashboard from "./components/pages/student/HomePage";
const App = () => {
  const { role: userRole } = useUserRole();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {userRole === "admin" && (
          <>
            <Route path="/admin" element={<AdminDashboard />}>
              <Route path="/admin/students" element={<StudentPage />} />
              <Route path="/admin/lecturers" element={<LecturerPage />} />
              <Route path="/admin/courses" element={<CoursePage />} />
              <Route path="/admin/edit-marks" element={<EditMarks />} />
            </Route>
            /
          </>
        )}
        {userRole === "student" && (
          <Route path="/student" element={<StudentDashboard />}>
            <Route
              path="/student/course-registration"
              element={<CourseRegistration />}
            />
          </Route>
        )}
        {userRole === "lecturer" && (
          <Route path="/lecturer" element={<LecturerDashboard />}>
            <Route path="/lecturer/courses" element={<LecturerCourses />} />
          </Route>
        )}
        <Route path="/admin" element={<UnauthorizedAccess />} />
        <Route path="/student" element={<UnauthorizedAccess />} />
        <Route path="/lecturer" element={<UnauthorizedAccess />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
