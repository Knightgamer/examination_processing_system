// EditMarks.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import EditGradeModal from "./EditGradeModal";

function EditMarks() {
  const [data, setData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);

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
    setEditingStudent(student);
    setIsModalOpen(true);
    setEditingCourse(courseInfo);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setEditingCourse(null);
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
    return scores.map((scoreObj, index) => (
      <span key={index}>
        {index > 0 && ", "} {scoreObj.score} / {scoreObj.maxScore}
      </span>
    ));
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Student Grades</h1>
      {Object.entries(data).map(([semester, courses]) => (
        <div key={semester} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Semester: {semester}</h2>
          {Object.entries(courses).map(
            ([courseName, { lecturer, students }]) => (
              <div
                key={courseName}
                className="mb-4 bg-white p-4 rounded shadow"
              >
                <h3 className="text-lg font-semibold">
                  Course: {courseName} - Lecturer: {lecturer}
                </h3>
                <ul>
                  {students.map((student) => (
                    <li
                      key={student.id}
                      className="flex items-center justify-between border-b py-2"
                    >
                      <span className="mr-2">
                        <strong>{student.name}</strong>:
                        <div>
                          <p>
                            Assignment Scores:{" "}
                            {formatScores(student.assignmentScores) || "N/A"}
                          </p>
                          <p>
                            CAT Scores:{" "}
                            {formatScores(student.catScores) || "N/A"}
                          </p>
                          <p>
                            Exam Score:{" "}
                            {student.examScore
                              ? student.examScore.score
                              : "N/A"}
                          </p>
                          <p>
                            Special Consideration:{" "}
                            {student.specialConsideration &&
                            student.specialConsideration.isApplicable
                              ? "Yes"
                              : "No"}
                          </p>
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
