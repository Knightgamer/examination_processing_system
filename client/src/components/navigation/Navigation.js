import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  FaChalkboardTeacher,
  FaClipboard,
  FaHome,
  FaUsers,
} from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";
import UserRoleContext from "../UserRoleContext";

const Navigation = () => {
  const { role, logout, accessToken } = useContext(UserRoleContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (accessToken) {
        try {
          const response = await axios.get(
            "http://localhost:5000/users/current",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching user data", error);

          // Check if the error status code indicates token expiration (e.g., 401 Unauthorized)
          if (error.response && error.response.status === 401) {
            // Token has expired, navigate to the login page
            navigate("/login");
          }
        }
      }
    };

    fetchUserData();
  }, [accessToken, navigate]);

  // Function to get the initial of the name or the username
  const getUserInitial = (userData) => {
    if (userData.name) {
      return userData.name.charAt(0);
    }
    if (userData.username) {
      return userData.username.charAt(0);
    }
    return ""; // Default case if neither name nor username is available
  };

  const userInitial = getUserInitial(userData);

  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-y-auto">
      {/* Vertical Navigation Pane */}
      <nav className="w-64 h-auto overflow-y-auto bg-gray-700 text-white p-4">
        <div className="pl-4 pb-7 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white-800">Shivam</h1>
        </div>
        <ul>
          {/* Student Links */}
          {role === "student" && (
            <React.Fragment>
              <li className="mb-2">
                <Link
                  to="/student/home"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
                >
                  <FaHome className="w-5 h-5 mr-2" />
                  Student Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/student/course-registration"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
                >
                  <FaHome className="w-5 h-5 mr-2" />
                  Course Registration
                </Link>
              </li>
            </React.Fragment>
          )}

          {/* Lecturer Links */}
          {role === "lecturer" && (
            <React.Fragment>
              <li className="mb-2">
                <Link
                  to="/lecturer/home"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
                >
                  <FaChalkboardTeacher className="w-5 h-5 mr-2" />
                  Lecturer Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/lecturer/page"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
                >
                  {/* You can add more links for lecturer here */}
                </Link>
              </li>
            </React.Fragment>
          )}

          {/* Admin Links */}
          {role === "admin" && (
            <React.Fragment>
              <li className="mb-2">
                <Link
                  to="/admin"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
                >
                  <FaClipboard className="w-5 h-5 mr-2" />
                  Admin Dashboard
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/admin/reports"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
                >
                  <FaClipboard className="w-5 h-5 mr-2" />
                  Generate Reports
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/admin/courses"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
                >
                  <FaClipboard className="w-5 h-5 mr-2" />
                  Manage Courses
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/admin/students"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
                >
                  <FaUsers className="w-5 h-5 mr-2" />
                  Manage Students
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/admin/lecturers"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
                >
                  <FaUsers className="w-5 h-5 mr-2" />
                  Manage Lecturers
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/admin/edit-marks"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
                >
                  <FaClipboard className="w-5 h-5 mr-2" />
                  Edit Marks
                </Link>
              </li>
            </React.Fragment>
          )}
        </ul>
      </nav>

      {/* Horizontal Top Navigation Pane */}
      <div className="flex-1 flex flex-col">
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Knight
          </Link>

          {/* User Dropdown */}
          <div className="relative">
            <button
              className="flex items-center focus:outline-none"
              onClick={handleDropdown}
            >
              <img
                src={`https://ui-avatars.com/api/?name=${userInitial}&background=random&color=fff`}
                className="w-10 h-10 rounded-full"
                alt="User"
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg overflow-hidden z-10">
                <div className="flex flex-col items-center px-4 py-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${userInitial}&background=random&color=fff`}
                    className="w-28 h-28 rounded-full"
                    alt="User Avatar"
                  />
                  <div className="text-center px-4 py-3">
                    <p className="text-sm text-gray-800 font-medium">
                      {userData.name || userData.username}
                    </p>
                    <p className="text-xs text-gray-500">{userData.email}</p>
                  </div>
                </div>
                <ul className="list-none">
                  <li className="py-2">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
        <div className="flex-1 p-5">{<Outlet />}</div>
      </div>
    </div>
  );
};

export default Navigation;
