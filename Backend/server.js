// imports
const express = require("express");
const dotenv = require("dotenv");

// helper functions or methods
const app = express();
dotenv.config();

// defining variables
const PORT = process.env.PORT || 7000;

// defining AIPs
app.get("/", (req, res) => {
  res.send("API is running");
});

// server will listen to the requests in following manner
app.listen(PORT, console.log("started server on port 5000"));
