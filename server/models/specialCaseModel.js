const mongoose = require("mongoose");

const specialCaseSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    academic_year: Number,
    semester: String,
    reason: { type: String, required: true, enum: ["school fees", "medical"] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SpecialCase", specialCaseSchema);
