const express = require('express');
const router = express.Router();
const{
    getAllAnswers,
    createAnswer,
    deleteAnswer,
    updateAnswer,
    getAnswerByQuesId
} = require('../controller/forumController');

router.route('/').get(getAllAnswers).post(createAnswer);
router.route('/:id').get(getAnswerByQuesId).delete(deleteAnswer).patch(updateAnswer);
module.exports = router;