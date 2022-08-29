const express = require('express');
const {
  registerUser,
  authUser,
  allUsers,
} = require('../controllers/userControllers');

const router = express.Router();

// router instance is created which we can use for routing the API calls

router.route('/sign-up').post(registerUser);
router.route('/login').post(authUser);
router.route('/search').get(allUsers);

module.exports = router;
