import axios from "axios";
import React, { useState } from "react";

function EditGradeModal({ student, course, onClose, onSave }) {
  // State for each score
  const [assignmentScores, setAssignmentScores] = useState(
    student.assignmentScores || []
  );
  const [catScores, setCatScores] = useState(student.catScores || []);
  const [examScore, setExamScore] = useState(
    student.examScore ? student.examScore.score : 0
  );
  const [specialConsideration, setSpecialConsideration] = useState(
    student.specialConsideration || { isApplicable: false, reason: "" }
  );

  // Handle change in assignment scores
  const handleAssignmentScoreChange = (index, value) => {
    const updatedScores = [...assignmentScores];
    updatedScores[index] = { ...updatedScores[index], score: value };
    setAssignmentScores(updatedScores);
  };

  // Handle change in CAT scores
  const handleCatScoreChange = (index, value) => {
    const updatedScores = [...catScores];
    updatedScores[index] = { ...updatedScores[index], score: value };
    setCatScores(updatedScores);
  };

  // Function to handle form submission
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
                Assignment Scores
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
                CAT Scores
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
                Exam Score
              </label>
              <input
                type="number"
                value={examScore || ""}
                onChange={(e) => setExamScore(Number(e.target.value))}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Exam Score"
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
                  onChange={() =>
                    setSpecialConsideration({
                      ...specialConsideration,
                      isApplicable: !specialConsideration.isApplicable,
                    })
                  }
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
