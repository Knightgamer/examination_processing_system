import axios from "axios";
import React, { useEffect, useState } from "react";

const maxAssignmentScore = 15;
const maxCatScore = 20;
const maxExamScore = 30;

function EditGradeModal({ student, course, onClose, onSave }) {
  const [assignmentScores, setAssignmentScores] = useState([]);
  const [catScores, setCatScores] = useState([]);
  const [examScore, setExamScore] = useState(0);
  const [specialConsideration, setSpecialConsideration] = useState({
    isApplicable: false,
    reason: "",
  });

  useEffect(() => {
    setAssignmentScores(student.assignmentScores || []);
    setCatScores(student.catScores || []);
    setExamScore(student.examScore ? student.examScore.score : 0);
    setSpecialConsideration(
      student.specialConsideration || {
        isApplicable: false,
        reason: "",
      }
    );
  }, [student]);

  const handleAssignmentScoreChange = (index, value) => {
    const limitedValue = Math.min(value, maxAssignmentScore);
    const updatedScores = [...assignmentScores];
    updatedScores[index] = { ...updatedScores[index], score: limitedValue };
    setAssignmentScores(updatedScores);
  };

  const handleCatScoreChange = (index, value) => {
    const limitedValue = Math.min(value, maxCatScore);
    const updatedScores = [...catScores];
    updatedScores[index] = { ...updatedScores[index], score: limitedValue };
    setCatScores(updatedScores);
  };

  const handleExamScoreChange = (value) => {
    const limitedValue = Math.min(value, maxExamScore);
    setExamScore(limitedValue);

    // Disable special consideration if there is a value in exam score
    setSpecialConsideration({
      isApplicable: false,
      reason: "",
    });
  };

  const handleSpecialConsiderationChange = () => {
    // Disable exam score if special consideration is checked
    setExamScore(0);
    setSpecialConsideration({
      ...specialConsideration,
      isApplicable: !specialConsideration.isApplicable,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      student: student.id,
      course: course._id,
      assignmentScores,
      catScores,
      examScore: { score: examScore },
      specialConsideration,
    };

    try {
      let response = await axios.put(
        `http://localhost:5000/scores/${student.id}/${course._id}`,
        payload
      );
      if (response.status === 200) {
        onSave({ ...student, ...payload });
        onClose();
        // Reload the page after successful update
        window.location.reload();
      } else {
        alert("Failed to update scores: " + response.statusText);
      }
    } catch (error) {
      alert("Failed to update scores: " + error.message);
    }
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
            {/* Assignment Scores */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Assignment Scores (Max: {maxAssignmentScore})
              </label>
              {assignmentScores.map((score, index) => (
                <input
                  key={index}
                  type="number"
                  value={score.score || ""}
                  onChange={(e) =>
                    handleAssignmentScoreChange(index, Number(e.target.value))
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                  placeholder={`Assignment ${index + 1} Score`}
                />
              ))}
            </div>

            {/* CAT Scores */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                CAT Scores (Max: {maxCatScore})
              </label>
              {catScores.map((score, index) => (
                <input
                  key={index}
                  type="number"
                  value={score.score || ""}
                  onChange={(e) =>
                    handleCatScoreChange(index, Number(e.target.value))
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                  placeholder={`CAT ${index + 1} Score`}
                />
              ))}
            </div>

            {/* Exam Score */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Exam Score (Max: {maxExamScore})
              </label>
              <input
                type="number"
                value={examScore || ""}
                onChange={(e) => handleExamScoreChange(Number(e.target.value))}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  specialConsideration.isApplicable ? "bg-gray-200" : ""
                }`}
                placeholder="Exam Score"
                disabled={specialConsideration.isApplicable}
              />
            </div>

            {/* Special Consideration */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Special Consideration
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={specialConsideration.isApplicable || false}
                  onChange={handleSpecialConsiderationChange}
                  className="mr-2 leading-tight"
                />
                <span className="text-gray-700 text-sm">
                  Apply special consideration
                </span>
              </div>
              {specialConsideration.isApplicable && (
                <textarea
                  value={specialConsideration.reason || ""}
                  onChange={(e) =>
                    setSpecialConsideration({
                      ...specialConsideration,
                      reason: e.target.value,
                    })
                  }
                  placeholder="Reason for special consideration"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                />
              )}
            </div>
            {/* Submit Button */}
            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save
              </button>
              <button
                onClick={onClose}
                className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ml-2"
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
