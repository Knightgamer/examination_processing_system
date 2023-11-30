import axios from "axios";
import React, { useEffect, useState } from "react";
import ScoreEntryForm from "./ScoreEntryForm"; // Import the ScoreEntryForm component

function LecturerCourses() {
  const [coursesBySemester, setCoursesBySemester] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showScoreEntryForm, setShowScoreEntryForm] = useState(false);
  const [gradedStudents, setGradedStudents] = useState({}); // Track graded students

  const lecturerId = localStorage.getItem("userId");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/courses/lecturer/${lecturerId}`)
      .then((response) => {
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
    const gradedKey = `${student._id}_${selectedCourse._id}_${selectedCourse.semester}`;
    const isGraded = !!gradedStudents[gradedKey];

    if (!isGraded) {
      setSelectedStudent(student);
      setShowScoreEntryForm(true);
    }
  };

  useEffect(() => {
    const fetchScores = async () => {
      const newGradedStudents = {};

      for (let student of students) {
        try {
          const response = await axios.get(
            `http://localhost:5000/scores/${student._id}/${selectedCourse._id}`
          );
          const scoreData = response.data;

          // Check if score data is available for the student
          if (scoreData && scoreData._id) {
            const gradedKey = `${student._id}_${selectedCourse._id}_${selectedCourse.semester}`;
            newGradedStudents[gradedKey] = true;
          }
        } catch (error) {
          console.error(
            "Error fetching scores for student:",
            student._id,
            "; error:",
            error.response ? error.response.data : error.message
          );
        }
      }

      setGradedStudents(newGradedStudents);
    };

    if (students.length > 0 && selectedCourse) {
      fetchScores();
    }
  }, [students, selectedCourse]);

  const handleScoreFormClose = (gradedStudentId) => {
    if (gradedStudentId) {
      const gradedKey = `${gradedStudentId}_${selectedCourse._id}_${selectedCourse.semester}`;
      setGradedStudents({ ...gradedStudents, [gradedKey]: true });
    }
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
                {" "}
                {course.courseCode} - {course.courseName}
              </button>
            ))}
          </div>
        </div>
      ))}

      {selectedCourse && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          {/* ... */}
          {students.length > 0 ? (
            <ul>
              {students.map((student) => {
                const gradedKey = `${student._id}_${selectedCourse._id}_${selectedCourse.semester}`;
                const isGraded = !!gradedStudents[gradedKey];

                return (
                  <div
                    key={student._id}
                    className="flex items-center justify-between bg-white shadow-sm p-4 mb-2 rounded-lg"
                  >
                    <span
                      className={`${
                        isGraded ? "text-green-600" : "text-gray-800"
                      } text-lg font-medium`}
                    >
                      {student.name}
                      {isGraded && (
                        <span className="ml-2 text-green-600">✔️</span>
                      )}
                    </span>
                    <button
                      onClick={() => handleStudentSelect(student)}
                      disabled={isGraded}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        isGraded
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {isGraded ? "Graded" : "Grade"}
                    </button>
                  </div>
                );
              })}
            </ul>
          ) : (
            <p>No students registered for this course.</p>
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
