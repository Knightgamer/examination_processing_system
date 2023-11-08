const express = require("express");
const errorHandler = require("./middleware/errorHandler2");
const connectDb = require("./config/dbConnection");
// const connectDb = require("./config/dbConnection");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5001; // Use the environment port if available, or use port 3000 as a default

connectDb();
// Define a route that responds with "Hello, World!" when you access the root URL
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use(errorHandler);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
