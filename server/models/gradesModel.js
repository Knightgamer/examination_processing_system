const mongoose = require("mongoose");

const gradeSchema = mongoose.Schema(
  {
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },
    assignment1: Number,
    assignment2: Number,
    cat1: Number,
    cat2: Number,
    exam: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Grade", gradeSchema);
