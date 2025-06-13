const express = require('express');
const router = express.Router();

const meController = require('../controllers/MeController');

// GET /me/api/get-user-info
router.get('/api/get-user-info', meController.getRole)

// GET /me/:userId
router.get('/:userId', meController.userInformation)

// GET /me
router.get('/', meController.index)


module.exports = router;

