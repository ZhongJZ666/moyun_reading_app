const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const UserBookController = require('../controllers/userBook.controller');

router.post('/', auth(), UserBookController.addBook);
router.get('/', auth(), UserBookController.getBooks);
router.delete('/:book_id', auth(), UserBookController.removeBook);

module.exports = router; 