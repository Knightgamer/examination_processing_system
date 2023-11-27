import axios from "axios";
import React, { useEffect, useState } from "react";
function CourseRegistration() {
  // State variables to store courses, selected courses, and loading status
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [registeredCourses, setRegisteredCourses] = useState([]);

  // Fetch courses from backend when component mounts
  useEffect(() => {
    axios
      .get("http://localhost:5000/courses")
      .then((response) => {
        setCourses(response.data);
        setIsLoading(false);
        // Extract unique semesters
        const uniqueSemesters = Array.from(
          new Set(response.data.map((course) => course.semester))
        );
        setSemesters(uniqueSemesters);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  // Fetch registered courses for the student
  useEffect(() => {
    const studentId = localStorage.getItem("userId"); // Adjust as per your implementation
    if (studentId) {
      axios
        .get(`http://localhost:5000/student/${studentId}`) // Adjust with your actual endpoint
        .then((response) => {
          // Flatten the course data
          const flattenedCourses = response.data.flatMap(
            (registration) => registration.courses
          );
          setRegisteredCourses(flattenedCourses);
        })
        .catch((error) =>
          console.error("Error fetching registered courses:", error)
        );
    }
  }, []);

  // Group flattened registered courses by semester
  const coursesBySemester = registeredCourses.reduce((acc, course) => {
    acc[course.semester] = acc[course.semester] || [];
    acc[course.semester].push(course);
    return acc;
  }, {});

  // Function to handle course selection
  const handleCourseSelection = (courseId) => {
    setSelectedCourses((prevSelectedCourses) => {
      if (prevSelectedCourses.includes(courseId)) {
        return prevSelectedCourses.filter((id) => id !== courseId);
      } else {
        return [...prevSelectedCourses, courseId];
      }
    });
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedCourses.length < 5) {
      alert("You must select at least 5 courses.");
      return;
    }

    // Retrieve student ID from local storage
    const studentId = localStorage.getItem("userId"); // Adjust the key as per your implementation

    if (!studentId) {
      alert("No student ID found. Please log in.");
      return;
    }

    console.log(
      "Submitting courses:",
      selectedCourses,
      "for student:",
      studentId
    );

    axios
      .post("http://localhost:5000/student/register", {
        student: studentId,
        courses: selectedCourses,
      })
      .then((response) => {
        alert("Courses registered successfully");
      })
      .catch((error) => {
        console.error("Error registering courses:", error);
        alert("Failed to register courses. Please try again.");
      });
  };
  // Function to handle semester selection
  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };
  // Filter courses based on selected semester
  const filteredCourses = courses.filter(
    (course) => course.semester === selectedSemester
  );
  // Render loading message if data is still being fetched
  if (isLoading) {
    return <div>Loading courses...</div>;
  }

  // Render form with course checkboxes and submit button
  return (
    <div className="">
      <div className="bg-white rounded-lg shadow p-8 w-[100%]">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Course Registration
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="semester" className="text-gray-700 block mb-2">
              Select Semester:
            </label>
            <select
              id="semester"
              value={selectedSemester}
              onChange={handleSemesterChange}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            >
              <option value="">--Choose a Semester--</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>
          {filteredCourses.map((course) => (
            <div key={course._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={course._id}
                value={course._id}
                onChange={() => handleCourseSelection(course._id)}
                disabled={!selectedSemester}
                className="mr-2"
              />
              <label htmlFor={course._id} className="text-gray-800">
                {course.courseCode} - {course.courseName} -{" "}
                {course.lecturer.name}
              </label>
            </div>
          ))}
          <button
            type="submit"
            disabled={!selectedSemester}
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-300 focus:outline-none focus:ring focus:ring-indigo-200"
          >
            Register Courses
          </button>
        </form>
        <div className="printable mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Registered Courses
          </h2>
          {Object.keys(coursesBySemester).map((semester) => (
            <div key={semester} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {semester}
              </h3>
              <table className="w-full text-left bg-white rounded-lg shadow">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Course Code</th>
                    <th className="px-4 py-2">Course Name</th>
                    <th className="px-4 py-2">Lecturer</th>
                  </tr>
                </thead>
                <tbody>
                  {coursesBySemester[semester].map((course) => (
                    <tr key={course._id} className="border-b">
                      <td className="px-4 py-2">{course.courseCode}</td>
                      <td className="px-4 py-2">{course.courseName}</td>
                      <td className="px-4 py-2">{course.lecturer.name}</td>{" "}
                      {/* Adjust as per your data structure */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseRegistration;
//
//This code provides a user interface for course registration. It fetches a list of courses from the backend and displays them as checkboxes. The user can select up to 5 courses and submit the form. The selected courses are then sent to the backend for registration..</s>
