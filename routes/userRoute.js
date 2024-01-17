const express = require('express');
const router = express.Router();
const user = require('../controllers/user');

router.route('/')
    .get(user.getAllUsers)
    .post(user.createUser);

router.get('/:id/logs', user.getUserExerciseLogs);

module.exports = router;