//client\src\components\pages\LoginPage.js
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "../UserRoleContext"; // Import the custom hook

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { updateRole, updateAccessToken } = useUserRole(); // Use the context hook

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/users/login", {
        email,
        password,
      });
      const { accessToken, userInfo } = response.data;

      // Update the role and access token in the context and local storage
      updateAccessToken(accessToken);
      updateRole(userInfo.role);
      console.log("Role updated to:", userInfo.role);

      // Redirect based on user role
      switch (userInfo.role) {
        case "admin":
          navigate("/admin");
          break;
        case "lecturer":
          navigate("/lecturer");
          break;
        case "student":
          navigate("/student");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (err) {
      setError(err.response?.data.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Login
          </h2>
          {error && (
            <div className="text-red-500 text-sm">{error}</div> // Display error message if there is an error
          )}
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                className="font-medium text-indigo-600 hover:text-indigo-500"
                // Add any onClick event handler if needed
              >
                Forgot your password?
              </button>
            </div>
            <div className="text-sm">
              <button className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
