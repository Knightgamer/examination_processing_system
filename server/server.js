const express = require("express");
const errorHandler = require("./middleware/errorHandler2.js");
const connectDb = require("./config/dbConnection");
const cors = require("cors"); // Add CORS middleware

const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5001;

connectDb();

app.use(express.json());

// Enable CORS to allow requests from your React frontend
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/contacts", require("./routes/contactRoutes"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});