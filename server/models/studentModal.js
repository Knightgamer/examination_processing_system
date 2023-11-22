const mongoose = require("mongoose");

const studentConstraintSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    academic_year: Number,
    semester: String,
    max_courses_per_semester: { type: Number, default: 5 },
    max_courses_per_year: { type: Number, default: 10 },
  },
  {
    timestamps: true,
  }
);

const StudentConstraint = mongoose.model(
  "StudentConstraint",
  studentConstraintSchema
);
module.exports = StudentConstraint;
