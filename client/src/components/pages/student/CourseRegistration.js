import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
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

  // Function to fetch registered courses
  const fetchRegisteredCourses = () => {
    const studentId = localStorage.getItem("userId");
    if (studentId) {
      axios
        .get(`http://localhost:5000/student/${studentId}`) // Adjust the endpoint as per your setup
        .then((response) => {
          // Ensure detailed courses include lecturer data
          const detailedCourses = response.data.flatMap((reg) =>
            reg.courses.map((courseReg) => ({
              ...courseReg.course,
              semester: courseReg.semester,
            }))
          );
          setRegisteredCourses(detailedCourses);
        })
        .catch((error) =>
          console.error("Error fetching registered courses:", error)
        );
    }
  };

  // Fetch registered courses for the student when component mounts
  useEffect(() => {
    fetchRegisteredCourses();
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
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation for minimum and maximum course selection
    if (selectedCourses.length < 5) {
      alert("You must select at least 5 courses.");
      return;
    } else if (selectedCourses.length > 7) {
      alert("You have reached the maximum courses registration.");
      return;
    }

    // Retrieve student ID from local storage
    const studentId = localStorage.getItem("userId");
    if (!studentId) {
      alert("No student ID found. Please log in.");
      return;
    }

    try {
      // Prepare the courses data for submission
      const coursesForSubmission = selectedCourses.map((courseId) => {
        return {
          course: courseId,
          semester: selectedSemester,
        };
      });

      // Post the selected courses with semester information to the registration endpoint
      await axios.post("http://localhost:5000/student/register", {
        student: studentId,
        courses: coursesForSubmission,
      });

      // Notify user of successful registration
      alert("Courses registered successfully");
      // Fetch updated courses after successful registration
      fetchRegisteredCourses();
      // Fetch the updated list of registered courses
      const updatedCoursesResponse = await axios.get(
        `http://localhost:5000/student/${studentId}`
      );
      const updatedFlattenedCourses = updatedCoursesResponse.data.flatMap(
        (registration) => registration.courses
      );

      // Update the state with the new list of registered courses
      setRegisteredCourses(updatedFlattenedCourses);

      // Optionally, reset the selected courses
      setSelectedCourses([]);
    } catch (error) {
      // Handle errors in registration process
      console.error("Error registering courses:", error);
      alert("Failed to register courses. Please try again.");
    }
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
          <input type="hidden" name="semester" value={selectedSemester} />
          <button
            type="submit"
            disabled={!selectedSemester}
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-300 focus:outline-none focus:ring focus:ring-indigo-200"
          >
            Register Courses
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Registered Courses
          </h2>
          {Object.keys(coursesBySemester).length > 0 ? (
            Object.keys(coursesBySemester).map((semester) => (
              <div key={semester} className="mb-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {semester}
                </h3>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course Code</TableCell>
                        <TableCell>Course Name</TableCell>
                        <TableCell>Lecturer</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {coursesBySemester[semester].map((course, index) => (
                        <TableRow key={index}>
                          <TableCell>{course.courseCode}</TableCell>
                          <TableCell>{course.courseName}</TableCell>
                          <TableCell>
                            {course.lecturer
                              ? course.lecturer.name
                              : "Not Assigned"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ))
          ) : (
            <p>No registered courses to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseRegistration;
//
//This code provides a user interface for course registration. It fetches a list of courses from the backend and displays them as checkboxes. The user can select up to 5 courses and submit the form. The selected courses are then sent to the backend for registration..</s>
