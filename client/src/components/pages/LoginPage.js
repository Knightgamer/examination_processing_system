import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Reset error message

    try {
      // Attempt to log in
      const response = await axios.post("http://localhost:5000/users/login", {
        email,
        password,
      });

      // Assuming that the server response contains an object with the accessToken
      // and the user information, including their role

      // Inside your handleSubmit function after login is successful

      console.log("Login Response:", response.data); // Log the response data to inspect it

      const { accessToken, user } = response.data;

      // Debug: Log the role
      console.log("User role from server:", user.role);

      // Assuming localStorage is used to store the role (consider a more secure storage method for actual role)
      localStorage.setItem("token", accessToken);
      localStorage.setItem("role", user.role);

      // Check the user's role and navigate accordingly
      if (user && user.role) {
        switch (user.role) {
          case "student":
            navigate("/student/home");
            break;
          // case "lecturer":
          //   navigate("/lecturer/home");
          //   break;
          // case "administrator": // Make sure this matches the role exactly as in the schema
          //   navigate("/administrator/home");
          //   break;
          default:
            setError("Your role is not recognized or you are not authorized.");
            break;
        }
      } else {
        // If there is no role present in the response
        setError("The login response did not contain the user role.");
      }
    } catch (err) {
      if (err.response) {
        // Server responded with a status code that falls out of the range of 2xx
        setError(
          err.response.data.message || "An error occurred during login."
        );
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response from server. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an error
        setError("There was an error setting up the login request.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Login
          </h2>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div>
            <label htmlFor="email" className="sr-only">
              email
            </label>
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="email"
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
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </a>
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
