const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    course_name: { type: String, required: true },
    course_code: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

// const Course = mongoose.model("Course", courseSchema);
module.exports = mongoose.model("Course", courseSchema);
