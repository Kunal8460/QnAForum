const express = require('express');
const {getOtp} = require('../controller/forumController');
const router = express.Router();
router.route('/:email').get(getOtp);

module.exports = router;