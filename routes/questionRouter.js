const express = require('express');
const router = express.Router();
const{
    getAllQuestions,
    createQuestion,
    deleteQuestion,
    updateQuestion,
    getQuestionByUserId,
    getQuestionByUni
} = require('../controller/forumController');


router.route('/').get(getAllQuestions).post(createQuestion);
router.route('/:id').get(getQuestionByUserId).delete(deleteQuestion).patch(updateQuestion);
router.route('/byUni/:uniId').get(getQuestionByUni);
module.exports = router;