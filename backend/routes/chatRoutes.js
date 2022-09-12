const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  accessOrCreateChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require('../controllers/chatControllers');
const router = express.Router();

//creating the chat routes

router.route('/').post(protect, accessOrCreateChat);
router.route('/').get(protect, fetchChats);
router.route('/group').post(protect, createGroupChat);
router.route('/rename-group').put(protect, renameGroup);
router.route('/add-to-group').put(protect, addToGroup);
router.route('/remove-from-group').put(protect, removeFromGroup);

module.exports = router;
