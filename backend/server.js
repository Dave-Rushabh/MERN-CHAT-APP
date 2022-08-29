const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./configs/db');
const userRoutes = require('./routes/userRoutes');
// add all other routes here
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
app.use(express.json()); // to accept JSON data
dotenv.config(); // accessing the env variables
connectDB();

// handling CORS
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const PORT = process.env.PORT || 7000;

app.use('/api/user', userRoutes);

// if any route is not matched, it will fall back to the below handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, console.log(`started server on port ${PORT}`));
