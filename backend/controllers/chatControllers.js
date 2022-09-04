const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const accessOrCreateChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  // the user with whom you want to access / create the chat
  // this user id is not the id of currently logged in user
  if (!userId) {
    throw new Error('could not access / create the chat');
    return res.sendStatus(400);
  }
  // checking if chat exists or not
  let isChatAvailable = await Chat.find({
    isGroupChat: false, // condition for checking one on one chats

    // the chat between 2 uers:
    // one user must be the one who is logged in -- user 1
    // another user is the one whose id is passed in the body -- user 2

    // and condition that validates both users exists
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } }, // this is -- user 1
      { users: { $elemMatch: { $eq: userId } } }, // this is -- user 2
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');

  let foundChat = await User.populate(isChatAvailable, {
    path: ' latestMessage.sender',
    select: 'name pic email',
  });

  // if chat exists send the chat between the two

  if (foundChat.length > 0) {
    res.send(foundChat[0]);
  }

  // else create a new chat between the two users
  else {
    const chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const newCreatedChat = await Chat.findOne({
        _id: createdChat._id,
      }).populate('users', '-password');

      res.status(200);
      res.send(newCreatedChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

// fetch all chats a user has with other users
const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        const resultsUpdated = await User.populate(results, {
          path: ' latestMessage.sender',
          select: 'name pic email',
        });
        res.status(200);
        res.send(resultsUpdated);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//creating a group chat
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send('Please fill all the fields');
  }
  const users = JSON.parse(req.body.users);
  users.push(req.user);
  if (users.length <= 2) {
    return res.status(400).send('Group chats require at least 3 members !');
  }
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const createdGroupChat = await Chat.findOne({
      _id: groupChat._id,
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(createdGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { accessOrCreateChat, fetchChats, createGroupChat };
