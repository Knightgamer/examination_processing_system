// models/scoreModel.js
const mongoose = require("mongoose");
const validGrades = [
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "D-",
  "F",
  "N/A",
];

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
    grade: {
      type: String,
      enum: validGrades,
      default: "N/A",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Score", scoreSchema);
