const express = require('express');
const router = express.Router();

const apiController = require('../controllers/ApiController');

// GET /api/user/all-user
router.get('/user/all-user', apiController.apiAllUser)

// GET /api/user-current  take user current
router.get('/user-current', apiController.apiUserCurrent)

module.exports = router