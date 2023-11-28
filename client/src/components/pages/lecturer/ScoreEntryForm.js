import axios from "axios";
import React, { useState } from "react";

function ScoreEntryForm({ student, courseId }) {
  // Updated maximum scores
  const maxAssignmentScore = 15;
  const maxCatScore = 20;
  const maxExamScore = 30;

  // Updated initial score structures
  const initialScore = { score: 0, maxScore: maxAssignmentScore };
  const initialScores = [initialScore, initialScore];

  // State for different scores and considerations
  const [assignmentScores, setAssignmentScores] = useState(initialScores);
  const [catScores, setCatScores] = useState(initialScores);
  const [examScore, setExamScore] = useState({
    score: 0,
    maxScore: maxExamScore,
  });
  const [specialConsideration, setSpecialConsideration] = useState({
    isApplicable: false,
    reason: "",
  });

  // State to track whether the exam input should be disabled
  const [examInputDisabled, setExamInputDisabled] = useState(false);

  // Function to handle score change
  const handleScoreChange = (e, index, type) => {
    const { name, value } = e.target;
    const maxScore = type === "assignment" ? maxAssignmentScore : maxCatScore;
    const newScores = type.map((score, i) =>
      i === index
        ? { ...score, [name]: Math.min(Number(value), maxScore), maxScore }
        : score
    );
    type === "assignment"
      ? setAssignmentScores(newScores)
      : setCatScores(newScores);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        student: student._id,
        course: courseId,
        assignmentScores,
        catScores,
        examScore,
        specialConsideration,
      };

      await axios.post("http://localhost:5000/scores", payload);
      alert("Scores updated successfully!");
    } catch (error) {
      console.error("Error updating scores:", error);
      alert("Failed to update scores.");
    }
  };

  // Function to handle special consideration checkbox change
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
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">Enter Scores for {student.name}</h2>
      <form onSubmit={handleSubmit}>
        {/* Assignment Scores */}
        {assignmentScores.map((score, index) => (
          <div key={`assignment-${index}`} className="mb-4">
            <label className="block mb-2">
              Assignment {index + 1} Score (Max: {maxAssignmentScore})
            </label>
            <input
              type="number"
              name="score"
              value={score.score}
              onChange={(e) => handleScoreChange(e, index, "assignment")}
              className="border rounded-md p-2 w-full"
              min="0"
              max={maxAssignmentScore}
            />
          </div>
        ))}

        {/* CAT Scores */}
        {catScores.map((score, index) => (
          <div key={`cat-${index}`} className="mb-4">
            <label className="block mb-2">
              CAT {index + 1} Score (Max: {maxCatScore})
            </label>
            <input
              type="number"
              name="score"
              value={score.score}
              onChange={(e) => handleScoreChange(e, index, "cat")}
              className="border rounded-md p-2 w-full"
              min="0"
              max={maxCatScore}
            />
          </div>
        ))}

        {/* Exam Score */}
        <div className="mb-4">
          <label className="block mb-2">
            Final Exam Score (Max: {maxExamScore})
          </label>
          <input
            type="number"
            name="score"
            value={examScore.score}
            onChange={(e) => {
              if (!examInputDisabled) {
                // Only update if the exam input is not disabled
                setExamScore({
                  ...examScore,
                  score: Math.min(Number(e.target.value), maxExamScore),
                });
              }
            }}
            className={`border rounded-md p-2 w-full ${
              examInputDisabled ? "bg-gray-200" : ""
            }`} // Disable the input when necessary
            min="0"
            max={maxExamScore}
            disabled={examInputDisabled} // Disable the input based on the state
          />
        </div>

        {/* Special Consideration */}
        <div className="mb-4">
          <label className="block mb-2">Special Consideration</label>
          <input
            type="checkbox"
            checked={specialConsideration.isApplicable}
            onChange={handleSpecialConsiderationChange} // Handle checkbox change
            className="mr-2"
          />
          {specialConsideration.isApplicable && (
            <input
              type="text"
              value={specialConsideration.reason}
              onChange={(e) =>
                setSpecialConsideration({
                  ...specialConsideration,
                  reason: e.target.value,
                })
              }
              className="border rounded-md p-2 w-full"
              placeholder="Enter reason for special consideration"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Submit Scores
        </button>
      </form>
    </div>
  );
}

export default ScoreEntryForm;
