// models/scoreModel.js
const mongoose = require("mongoose");

const scoreSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    assignmentScores: [
      {
        score: Number,
        maxScore: Number,
      },
    ],
    catScores: [
      {
        score: Number,
        maxScore: Number,
      },
    ],
    examScore: {
      score: Number,
      maxScore: Number,
    },
    specialConsideration: {
      isApplicable: { type: Boolean, default: false },
      reason: { type: String, default: "" }, // Reason like 'school fees' or 'medical'
    },
    grade: String, // Add a field for storing the grade
  },
  { timestamps: true }
);

module.exports = mongoose.model("Score", scoreSchema);
