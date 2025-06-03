const express = require('express');
const router = express.Router();

const authController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/authMiddleware')

// [GET] /auth/login
router.get('/login', authController.login)

// [GET] /auth/logout
router.get('/logout', authController.logout)

router.post('/login/authentication', authController.authentication)

// [POST] /auth/register-new
router.post('/register-new', authController.registerNew)

// [GET] /auth/register
router.get('/register', authController.register)

module.exports = router;