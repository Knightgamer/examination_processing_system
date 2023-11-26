import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
          // Optional: Redirect to login if unauthorized
        }
      }
    };

    fetchUserData();
  }, [accessToken]);

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
    <div className="flex h-screen">
      {/* Vertical Navigation Pane */}
      <nav className="w-64 bg-gray-800 text-gray-200 p-4">
        <ul>
          {role === "student" && (
            <li className="mb-2">
              <Link
                to="/student/home"
                className="text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Student Home
              </Link>
            </li>
          )}
          {role === "lecturer" && (
            <li className="mb-2">
              <Link
                to="/lecturer/home"
                className="text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Lecturer Home
              </Link>
            </li>
          )}
          {role === "admin" && (
            <li className="mb-2">
              <Link
                to="/admin/dashboard"
                className="text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Admin Dashboard
              </Link>
            </li>
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

        {/* Main content area */}
        <div className="flex-1 p-5">{/* Content goes here */}</div>
      </div>
    </div>
  );
};

export default Navigation;
