const express = require('express');
const router = express.Router();

const meController = require('../controllers/MeController');
const authMiddleware = require('../middleware/authMiddleware')

// GET /me
router.use('/', meController.index)


module.exports = router;

