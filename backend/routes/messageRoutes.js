const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const {
  sendMessage,
  getMessagesByChatId,
} = require('../controllers/messageControllers');

router.route('/send-message').post(protect, sendMessage);
router.route('/get-messages/:chatId').get(protect, getMessagesByChatId);

module.exports = router;
