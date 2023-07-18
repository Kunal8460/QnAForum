const express = require('express');
const { createClassroom } = require('../controller/forumController');
const router = express.Router();
router.route('/').post(createClassroom);

module.exports = router;