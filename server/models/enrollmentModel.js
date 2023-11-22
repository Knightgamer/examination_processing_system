const mongoose = require("mongoose");

const enrollmentSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    semester: { type: String, required: true },
    academic_year: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Enrollment = (module.exports = mongoose.model(
  "Enrollment",
  enrollmentSchema
));
