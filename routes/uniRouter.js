const express = require('express');
const router = express.Router();
const {getUniversity, getAllUniversity, createUniversity} = require("../controller/forumController");

//university router
router.route('/').get(getAllUniversity).post(createUniversity);
router.route('/:emailPostfix').get(getUniversity);
module.exports = router;