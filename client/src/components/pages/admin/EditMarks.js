// EditMarks.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import EditGradeModal from "./EditGradeModal";

function EditMarks() {
  const [data, setData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null); // Add state for editing course

  useEffect(() => {
    axios
      .get("http://localhost:5000/scores")
      .then((response) => {
        const organizedData = organizeData(response.data);
        setData(organizedData);
      })
      .catch((error) => console.error("Error fetching scores:", error));
  }, []);

  const organizeData = (grades) => {
    const organized = {};

    grades.forEach((grade) => {
      const {
        course,
        student,
        assignmentScores,
        catScores,
        examScore,
        specialConsideration,
      } = grade;
      const semester = course.semester || "Unknown Semester";
      const courseCode = course.courseCode || "Unknown Course Code";
      const courseName = course.courseName || "Unknown Course";
      const lecturerName = course.lecturer
        ? course.lecturer.name
        : "Unknown Lecturer";

      if (!organized[semester]) {
        organized[semester] = {};
      }

      if (!organized[semester][courseName]) {
        organized[semester][courseName] = {
          lecturer: lecturerName,
          students: [],
        };
      }

      organized[semester][courseName].students.push({
        id: student._id,
        name: student.name,
        assignmentScores,
        catScores,
        examScore,
        specialConsideration,
        course: course,
      });
    });

    return organized;
  };

  const handleEdit = (student, courseInfo) => {
    //console.log("Editing Student:", student);
    // console.log("Editing Course Info:", courseInfo);

    setEditingStudent(student);
    setIsModalOpen(true);
    setEditingCourse(courseInfo); // Assuming courseCode is unique and used as ID
  };

  const getCourseInfo = (student) => {
    // Extract the course information from the organized data
    const { semester, courseName } = student; // Adjust this based on your data structure
    return {
      semester,
      courseName,
      // Add any other course-related information you need
    };
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setEditingCourse(null); // Clear the editing course
  };

  const handleSave = (updatedStudent) => {
    setData((prevData) => {
      const newData = { ...prevData };
      Object.entries(newData).forEach(([semester, courses]) => {
        Object.entries(courses).forEach(([courseName, courseData]) => {
          courseData.students = courseData.students.map((student) => {
            if (student.id === updatedStudent.id) {
              return { ...student, ...updatedStudent };
            }
            return student;
          });
        });
      });
      return newData;
    });

    closeModal();
  };

  const formatScores = (scores) => {
    return scores
      .map((scoreObj, index) => <span key={index}>{scoreObj.score}</span>)
      .reduce((prev, curr) => [prev, ", ", curr]);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Student Grades</h1>
      {Object.entries(data).map(([semester, courses]) => (
        <div key={semester} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Semester: {semester}</h2>
          {Object.entries(courses).map(
            ([courseName, { lecturer, students }]) => (
              <div key={courseName} className="mb-4">
                <h3 className="text-lg font-semibold">
                  Course: {courseName} - Lecturer: {lecturer}
                </h3>
                <ul>
                  {students.map((student) => (
                    <li
                      key={student.id}
                      className="flex items-center justify-between"
                    >
                      <span className="mr-2">
                        <strong>{student.name}</strong>:
                        <div>
                          Assignment Scores:{" "}
                          {student.assignmentScores
                            ? formatScores(student.assignmentScores)
                            : "N/A"}
                          CAT Scores:{" "}
                          {student.catScores
                            ? formatScores(student.catScores)
                            : "N/A"}
                          Exam Score:{" "}
                          {student.examScore ? student.examScore.score : "N/A"}
                          Special Consideration:{" "}
                          {student.specialConsideration &&
                          student.specialConsideration.isApplicable
                            ? "Yes"
                            : "No"}
                        </div>
                      </span>
                      <button
                        onClick={() => handleEdit(student, student.course)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit className="inline-block text-xl" /> Edit
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      ))}
      {isModalOpen && editingStudent && editingCourse && (
        <EditGradeModal
          student={editingStudent}
          course={editingCourse}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default EditMarks;
