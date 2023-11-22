const mongoose = require("mongoose");

const lecturerCourseSchema = mongoose.Schema(
  {
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LecturerCourse", lecturerCourseSchema);
