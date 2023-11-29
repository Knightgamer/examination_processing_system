import axios from "axios";
import React, { useEffect, useState } from "react";
import { RiDeleteBin2Line } from "react-icons/ri";

function CoursePage() {
  // Define state variables
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    lecturer: "",
    semester: "",
    academicYear: "",
  });
  const [lecturers] = useState([]);
  // const [setLecturerMap] = useState({});
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/courses", formData);
      fetchCourses();
      setSuccessMessage("Course added successfully!"); // Set success message
      setErrorMessage(""); // Clear error message
    } catch (error) {
      console.error("Error adding course:", error);
      setErrorMessage("Error adding course. Please try again."); // Set error message
      setSuccessMessage(""); // Clear success message
    }
  };
  // Function to fetch the list of courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Function to fetch the list of lecturers and create a lecturer ID to name map
  // const fetchLecturers = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:5000/users/role/lecturer"
  //     );
  //     setLecturers(response.data);
  //     const map = {};
  //     response.data.forEach((lecturer) => {
  //       map[lecturer._id] = lecturer.name;
  //     });
  //     setLecturerMap(map);
  //   } catch (error) {
  //     console.error("Error fetching lecturers:", error);
  //   }
  // };

  const handleDelete = async (courseId) => {
    try {
      await axios.delete(`http://localhost:5000/courses/${courseId}`);
      // fetchLecturers();
      fetchCourses();
      setSuccessMessage("Course deleted successfully!"); // Set success message
      setErrorMessage(""); // Clear error message
    } catch (error) {
      console.error("Error deleting course:", error);
      setErrorMessage("Error deleting course. Please try again."); // Set error message
      setSuccessMessage(""); // Clear success message
    }
  };

  // Fetch courses and lecturers when the component mounts
  useEffect(() => {
    fetchCourses();
    // fetchLecturers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Course Management</h1>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label
            htmlFor="courseCode"
            className="block text-gray-700 font-semibold"
          >
            Course Code
          </label>
          <input
            type="text"
            id="courseCode"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="courseName"
            className="block text-gray-700 font-semibold"
          >
            Course Name
          </label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="lecturer"
            className="block text-gray-700 font-semibold"
          >
            Assign to Lecturer
          </label>
          <select
            id="lecturer"
            name="lecturer"
            value={formData.lecturer}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          >
            <option value="" disabled>
              Select a Lecturer
            </option>
            {lecturers.map((lecturer) => (
              <option key={lecturer._id} value={lecturer._id}>
                {lecturer.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="semester"
            className="block text-gray-700 font-semibold"
          >
            Semester
          </label>
          <input
            type="text"
            id="semester"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="academicYear"
            className="block text-gray-700 font-semibold"
          >
            Academic Year
          </label>
          <input
            type="text"
            id="academicYear"
            name="academicYear"
            value={formData.academicYear}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring"
        >
          Add Course
        </button>
      </form>

      <h1 className="text-2xl font-semibold mb-4">Course List</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Course Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Course Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Semester
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Academic Year
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lecturer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {courses.map((course) => (
            <tr key={course._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {course.courseCode}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {course.courseName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{course.semester}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {course.academicYear}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {course.lecturer.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleDelete(course._id)}
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
}

export default CoursePage;
