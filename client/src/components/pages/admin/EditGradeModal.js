import axios from "axios";
import React, { useEffect, useState } from "react";

function EditGradeModal({ student, course, onSave, onClose }) {
  const [assignmentScores, setAssignmentScores] = useState([]);
  const [catScores, setCatScores] = useState([]);
  const [examScore, setExamScore] = useState(0);
  const [specialConsideration, setSpecialConsideration] = useState({
    isApplicable: false,
    reason: "",
  });

  // Updated maximum scores
  const maxAssignmentScore = 15;
  const maxCatScore = 20;
  const maxExamScore = 30;

  // Updated initial score structures
  const initialScore = { score: 0, maxScore: maxAssignmentScore };
  const initialCatScore = { score: 0, maxScore: maxCatScore };
  const initialScores = [initialScore, initialScore];

  // State to track whether the exam input should be disabled
  const [examInputDisabled, setExamInputDisabled] = useState(false);

  // Inside EditGradeModal.js
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:5000/scores/${student.id}/${course.id}`
        );
        const data = response.data;
        setAssignmentScores(data.assignmentScores || []);
        setCatScores(data.catScores || []);
        setExamScore(data.examScore || 0);
        setSpecialConsideration(
          data.specialConsideration || {
            isApplicable: false,
            reason: "",
          }
        );
        console.log("Course ID:", course.id); // Log to verify course ID
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    }

    fetchData();
  }, [student.id, course.id]);

  const handleScoreChange = (e, index, type) => {
    const { name, value } = e.target;
    let newScores;

    if (type === "assignment") {
      newScores = [...assignmentScores];
      newScores[index] = {
        ...newScores[index],
        [name]: Math.min(Number(value), maxAssignmentScore),
      };
      setAssignmentScores(newScores);
    } else if (type === "cat") {
      newScores = [...catScores];
      newScores[index] = {
        ...newScores[index],
        [name]: Math.min(Number(value), maxCatScore),
      };
      setCatScores(newScores);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        student: student.id, // Ensure this is the student's ID
        course: course.id, // Ensure this is the course's ID
        assignmentScores,
        catScores,
        examScore,
        specialConsideration,
      };

      await axios.put(`http://localhost:5000/scores`, payload); // Adjust the endpoint as needed
      onSave({ ...student, ...payload });
      onClose();
    } catch (error) {
      console.error("Error updating scores:", error);
      alert("Failed to update scores.");
    }
  };

  const handleSpecialConsiderationChange = (e) => {
    const { checked } = e.target;

    // Disable or enable the exam input based on the checkbox status
    setExamInputDisabled(checked);

    // Update the special consideration checkbox state
    setSpecialConsideration({
      isApplicable: checked,
      reason: specialConsideration.reason,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

      <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div className="modal-content py-4 text-left px-6">
          <h2 className="text-xl font-semibold mb-4">
            Edit Grades for {student.name} - {course.semester},{" "}
            {course.courseName}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Assignment Scores
              </label>
              {assignmentScores.map((score, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="number"
                    name="score"
                    value={score.score}
                    onChange={(e) => handleScoreChange(e, index, "assignment")}
                    placeholder={`Assignment ${index + 1}`}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                CAT Scores
              </label>
              {catScores.map((score, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="number"
                    name="score"
                    value={score.score}
                    onChange={(e) => handleScoreChange(e, index, "cat")}
                    placeholder={`CAT ${index + 1}`}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Exam Score
              </label>
              <input
                type="number"
                name="score"
                value={examScore}
                onChange={(e) =>
                  setExamScore(Math.min(Number(e.target.value), maxExamScore))
                }
                placeholder="Exam Score"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  examInputDisabled ? "bg-gray-200" : ""
                }`}
                disabled={examInputDisabled}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Special Consideration
              </label>
              <input
                type="checkbox"
                name="isApplicable"
                checked={specialConsideration.isApplicable}
                onChange={handleSpecialConsiderationChange}
                className="mr-2 leading-tight"
              />
              <span className="text-gray-700 text-sm">
                Apply special consideration
              </span>
              {specialConsideration.isApplicable && (
                <div className="mt-2">
                  <textarea
                    name="reason"
                    value={specialConsideration.reason}
                    onChange={(e) =>
                      setSpecialConsideration({
                        ...specialConsideration,
                        reason: e.target.value,
                      })
                    }
                    placeholder="Reason for special consideration"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  ></textarea>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditGradeModal;
