import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Add the missing import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Navigation = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const userRole = localStorage.getItem("userRole");
  const [currentUser, setCurrentUser] = useState(null); // State to store the current user's data

  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  // Function to extract initials
  const getUserInitials = () => {
    if (currentUser) {
      const initials = `${currentUser.firstName.charAt(
        0
      )}${currentUser.lastName.charAt(0)}`;
      return initials.toUpperCase();
    }
    return "";
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token"); // Also remove the token
    navigate("/");
  };

  // Fetch current user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(
            "http://localhost:5000/users/current",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCurrentUser(response.data);
        } else {
          console.error("No token found");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [navigate]);
  return (
    <div className="flex h-screen">
      {/* Vertical Navigation Pane */}
      <nav className="w-64 bg-gray-800  text-gray-200 p-4">
        <ul>
          {userRole === "student" && (
            <li className="mb-2">
              <Link
                to="/home"
                className="text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
            </li>
          )}
          {userRole === "lecturer" && (
            <li className="mb-2">
              <Link
                to="/home"
                className="text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
            </li>
          )}
          {userRole === "administrator" && (
            <li className="mb-2">
              <Link
                to="/admin/dashboard"
                className="text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Horizontal Top Navigation Pane */}
      {/* Horizontal Top Navigation Pane */}
      <div className="flex-1 flex flex-col">
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
          {/* Place for logo or branding */}
          <div>
            <Link to="/" className="text-xl font-bold text-gray-800">
              MyApp
            </Link>
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              className="flex items-center focus:outline-none"
              onClick={handleDropdown}
            >
              <img
                src={`https://ui-avatars.com/api/?name=${getUserInitials()}&background=random&color=fff`}
                className="w-10 h-10 rounded-full"
                alt="User"
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg overflow-hidden z-10 rounded shadow-xl w-48">
                <div className="flex flex-col items-center px-4 py-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${getUserInitials()}&background=random&color=fff`}
                    className="w-28 h-28 rounded-full"
                    alt="User Avatar"
                  />
                  <div className="text-center px-4 py-3">
                    <p className="text-sm text-gray-800 font-medium">{`${currentUser?.firstName} ${currentUser?.lastName}`}</p>
                    <p className="text-xs text-gray-500">
                      {currentUser?.email}
                    </p>
                  </div>
                </div>
                <ul className="list-none">
                  <li className="py-2">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
