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
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/courses")
      .then((response) => {
        setCourses(response.data);
        setIsLoading(false);
        const uniqueSemesters = Array.from(
          new Set(response.data.map((course) => course.semester))
        );
        setSemesters(uniqueSemesters);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  useEffect(() => {
    const studentId = localStorage.getItem("userId");
    if (studentId) {
      axios
        .get(`http://localhost:5000/student/${studentId}`)
        .then((response) => {
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
  }, [triggerFetch]);

  const coursesBySemester = registeredCourses.reduce((acc, course) => {
    acc[course.semester] = acc[course.semester] || [];
    acc[course.semester].push(course);
    return acc;
  }, {});

  const handleCourseSelection = (courseId) => {
    setSelectedCourses((prevSelectedCourses) => {
      if (prevSelectedCourses.includes(courseId)) {
        return prevSelectedCourses.filter((id) => id !== courseId);
      } else {
        return [...prevSelectedCourses, courseId];
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedCourses.length < 5) {
      alert("You must select at least 5 courses.");
      return;
    } else if (selectedCourses.length > 7) {
      alert("You have reached the maximum courses registration.");
      return;
    }

    const studentId = localStorage.getItem("userId");
    if (!studentId) {
      alert("No student ID found. Please log in.");
      return;
    }

    try {
      const coursesForSubmission = selectedCourses.map((courseId) => {
        return {
          course: courseId,
          semester: selectedSemester,
        };
      });

      await axios.post("http://localhost:5000/student/register", {
        student: studentId,
        courses: coursesForSubmission,
      });

      alert("Courses registered successfully");
      setTriggerFetch(!triggerFetch);
      const updatedCoursesResponse = await axios.get(
        `http://localhost:5000/student/${studentId}`
      );
      const updatedFlattenedCourses = updatedCoursesResponse.data.flatMap(
        (registration) => registration.courses
      );

      setRegisteredCourses(updatedFlattenedCourses);
      setSelectedCourses([]);
    } catch (error) {
      console.error("Error registering courses:", error);
      alert("Failed to register courses. Please try again.");
    }
  };

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };

  const filteredCourses = courses.filter(
    (course) => course.semester === selectedSemester
  );

  if (isLoading) {
    return <div>Loading courses...</div>;
  }

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

        {/* Move the print button outside the form */}
        <button
          onClick={() => window.print()}
          className="mt-4 bg-indigo-500 text-white p-8 py-4 rounded-lg hover:bg-indigo-600 transition duration-300 focus:outline-none focus:ring focus:ring-indigo-200"
        >
          Print
        </button>
      </div>
    </div>
  );
}

export default CourseRegistration;
