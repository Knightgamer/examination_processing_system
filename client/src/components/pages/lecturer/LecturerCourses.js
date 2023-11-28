import axios from "axios";
import React, { useEffect, useState } from "react";
import ScoreEntryForm from "./ScoreEntryForm"; // Import the ScoreEntryForm component

function LecturerCourses() {
  const [courses, setCourses] = useState([]);
  const [coursesBySemester, setCoursesBySemester] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showScoreEntryForm, setShowScoreEntryForm] = useState(false);

  const lecturerId = localStorage.getItem("userId");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/courses/lecturer/${lecturerId}`)
      .then((response) => {
        setCourses(response.data);
        organizeCoursesBySemester(response.data);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, [lecturerId]);

  const organizeCoursesBySemester = (courses) => {
    const grouped = courses.reduce((acc, course) => {
      acc[course.semester] = acc[course.semester] || [];
      acc[course.semester].push(course);
      return acc;
    }, {});
    setCoursesBySemester(grouped);
  };

  const handleCourseSelect = async (course) => {
    setSelectedCourse(course);
    setIsLoading(true); // Set loading state to true while fetching data

    // Construct the URL with courseId and semester
    const url = `http://localhost:5000/student/${course._id}/semester/${course.semester}/students`;

    try {
      const response = await axios.get(url);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }

    setIsLoading(false); // Set loading state to false after fetching data
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setShowScoreEntryForm(true);
  };

  const handleScoreFormClose = () => {
    setSelectedStudent(null);
    setShowScoreEntryForm(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lecturer's Courses</h1>

      {Object.keys(coursesBySemester).map((semester) => (
        <div key={semester} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{semester}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coursesBySemester[semester].map((course) => (
              <button
                key={course._id}
                onClick={() => handleCourseSelect(course)}
                className="p-4 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
              >
                {course.courseName}
              </button>
            ))}
          </div>
        </div>
      ))}

      {selectedCourse && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h2 className="text-lg font-semibold mb-2">
            Students in {selectedCourse.courseName}
          </h2>
          {students.length > 0 ? (
            <ul>
              {students.map((student) => (
                <li
                  key={student._id}
                  className="mb-1 cursor-pointer text-blue-500 hover:underline"
                  onClick={() => handleStudentSelect(student)}
                >
                  {student.name} - {student.email}
                </li>
              ))}
            </ul>
          ) : (
            <p>No students registered for this course.</p> // Display message if no students
          )}
        </div>
      )}

      {/* Conditionally render ScoreEntryForm */}
      {showScoreEntryForm && selectedStudent && (
        <div className="mt-6">
          <ScoreEntryForm
            student={selectedStudent}
            courseId={selectedCourse._id}
            onClose={handleScoreFormClose} // Pass a callback to close the form
          />
        </div>
      )}
    </div>
  );
}

export default LecturerCourses;
