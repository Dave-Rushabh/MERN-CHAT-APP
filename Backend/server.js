// imports
const express = require("express");
const dotenv = require("dotenv");

// helper functions or methods
const app = express();
dotenv.config();

// tackle CORS
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// defining variables
const PORT = process.env.PORT || 7000;

// defining AIPs
app.get("/dummy", (req, res) => {
  res.send("API is running");
});

// server will listen to the requests in following manner
app.listen(PORT, console.log("started server on port 5000"));
