const express = require("express");
const errorHandler = require("./middleware/errorHandler2.js");
const connectDb = require("./config/dbConnection");
const cors = require("cors");

const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5001;

connectDb();

app.use(express.json());
app.use(cors()); // Enable CORS

// Default route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Route imports
app.use("/contacts", require("./routes/contactRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/courses", require("./routes/courseRoutes"));
app.use("/enrollments", require("./routes/enrollmentRoutes"));
app.use("/grades", require("./routes/gradeRoutes"));
app.use("/lecturercourse", require("./routes/lecturerCourseRoutes"));
app.use("/studentconstraints", require("./routes/studentConstraintRoutes"));
app.use("/specialcases", require("./routes/specialCaseRoutes"));
app.use("/permissions", require("./routes/permissionRoutes"));

// Error Handler Middleware
app.use(errorHandler);

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
