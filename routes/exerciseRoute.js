const express = require('express');
const router = express.Router();
const exercise = require('../controllers/exercise');

router.post('/:id/exercises', exercise.createExercise);

module.exports = router;