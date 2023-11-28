// models/registrationModel.js
const mongoose = require("mongoose");

const registrationSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        semester: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);


module.exports = mongoose.model("Registration", registrationSchema);
