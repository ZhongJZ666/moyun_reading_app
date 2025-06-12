const express = require('express');
const MentorController = require('../controllers/mentor.controller');
const auth = require('../middlewares/auth');

const router = express.Router();

// 导师工作台
router.get('/dashboard', auth(['mentor']), MentorController.getDashboard);

module.exports = router; 