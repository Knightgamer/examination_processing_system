const mongoose = require("mongoose");

const permissionSchema = mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["student", "lecturer", "administrator"],
    },
    permission_description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Permission", permissionSchema);
