const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add the contact name"],
      ref: "User",
    },
    email: {
      type: String,
      required: [true, "Please add the email address"],
      match: [/.+\@.+\..+/, "Please fill a valid e-mail address"],
    },
    phone: {
      type: String,
      required: [true, "Please add the phone number"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
