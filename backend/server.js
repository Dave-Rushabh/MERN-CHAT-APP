const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

const PORT = process.env.PORT || 7000;

app.get("/dummy", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, console.log("started server on port 5000"));
