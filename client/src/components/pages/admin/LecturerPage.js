import axios from "axios";
import React, { useEffect, useState } from "react";
import { RiDeleteBin2Line } from "react-icons/ri";

const LecturerPage = () => {
  const [lecturers, setLecturers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    const isFormValid = Object.values(formData).every((value) => value !== "");

    if (!isFormValid) {
      setRegistrationStatus("Please fill in all fields.");
      return;
    }

    // Add the role to the formData object
    formData.role = "lecturer";

    try {
      const response = await axios.post(
        "http://localhost:5000/users/register",
        formData
      );
      console.log("User registered successfully:", response.data);
      setRegistrationStatus("Lecturer added successfully");
      // Clear the form data
      setFormData({
        name: "",
        email: "",
        username: "",
        password: "",
      });
      // Fetch the updated list of lecturers after registration
      fetchLecturers();
    } catch (error) {
      console.error("Error registering user:", error);
      setRegistrationStatus("Error registering user. Please try again.");
    }
  };

  const fetchLecturers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/users/role/lecturer"
      );
      setLecturers(response.data);
    } catch (error) {
      console.error("Error fetching lecturers:", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`);
      // Fetch the updated list of lecturers after deletion
      fetchLecturers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    // Fetch the initial list of lecturers when the component mounts
    fetchLecturers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Lecturer Registration</h1>

      {registrationStatus && (
        <div className={`text-${registrationStatus === 'Registration Successful' ? 'green' : 'red'}-500 mb-4`}>
          {registrationStatus}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 font-semibold"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-semibold"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring"
        >
          Register
        </button>
      </form>

      <h1 className="text-2xl font-semibold mb-4">Lecturer List</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Username
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lecturers.map((lecturer) => (
            <tr key={lecturer._id}>
              <td className="px-6 py-4 whitespace-nowrap">{lecturer.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{lecturer.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {lecturer.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleDelete(lecturer._id)} // Pass the lecturer's ID to the delete function
                  className="text-red-600 hover:text-red-800 flex items-center"
                >
                  <RiDeleteBin2Line className="mr-1" /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LecturerPage;
