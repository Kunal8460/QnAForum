const express = require('express');
const {
    getUserById,
    getAllUsers,
    createUser,
    deleteUser,
    getUser,
    updateUser

} = require('../controller/forumController');

const router = express.Router();
// user router
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUserById).delete(deleteUser).patch(updateUser);
router.route('/user/:email').get(getUser);

//university router
// router.route('/uni/:emailPostfix').get(getUniversity);
module.exports = router;