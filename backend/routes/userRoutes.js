const express = require('express');
const {
  registerUser,
  authUser,
  allUsers,
} = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// router instance is created which we can use for routing the API calls

router.route('/sign-up').post(registerUser);
router.route('/login').post(authUser);
// added the middleware {protect} which will first authorize the user,
// if authorized then only {allUser} will be called
router.route('/search').get(protect, allUsers);
// if not the {allUser} will not be called

module.exports = router;
