const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./configs/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const path = require('path');

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
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes);

/**
 * DEPLOYMENT RELATED CODE STARTS HERE
 */

const __dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  // Establishing the path from current working directory to the build version
  app.use(express.static(path.join(__dirname, 'fronend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}
/**
 * DEPLOYMENT RELATED CODE ENDS HERE
 */

// if any route is not matched, it will fall back to the below handlers
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, console.log(`started server on port ${PORT}`));

const io = require('socket.io')(server, {
  pingTimeOut: 60000, // goes into inactive state if no message received for 1 minute
  cors: {
    origin: 'http://localhost:3000', // we give frontend server link to the backend
  },
});

io.on('connection', (socket) => {
  console.log('connected to socket.io');

  /**
   * The below function is a primary connection for a logged in user.
   */
  socket.on('setup', (userData) => {
    socket.join(userData._id); // takes the user information from the frontend
    socket.emit('connected'); // starts the seperate room for the given user
    console.log(userData._id);
  });

  /**
   * The below function connectes the other user(s) with the same chat.
   */
  socket.on('join chat', (room) => {
    socket.join(room);
    console.log(`user joined the room : ${room}`);
  });

  /**
   * The below socket is for typing start identification
   */
  socket.on('typing', (room) => {
    socket.in(room).emit('typing');
  });

  /**
   * The below socket is for typing end identification
   */
  socket.on('stop typing', (room) => {
    socket.in(room).emit('stop typing');
  });

  /**
   * This is the logic below.
   * When i as a user send a message the notification should go to all the users except me.
   */
  socket.on('new message', (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log('chat.users do not exist');

    chat.users.map((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit('message received', newMessageReceived);
    });
  });

  /**
   * Clean up of socket
   */
  socket.off('setup', () => {
    console.log('USER DISCONNECTED');
    socket.leave(userData._id);
  });
});
