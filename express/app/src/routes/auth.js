const express = require('express');
const router = express.Router();

const authController = require('../controllers/AuthController');

// [GET] /auth/login
router.get('/login', authController.login)

// [GET] /auth/logout
router.get('/logout', authController.logout)

router.post('/login/authentication', authController.authentication)

// [POST] /auth/register-new
router.post('/register-new', authController.registerNew)

// [GET] /auth/register
router.get('/register', authController.register)

// [GET] /auth/forgot-password
router.get('/forgot-password',authController.forgotPasswordPage)

// [POST] /auth/api/forgot-password
router.post('/api/forgot-password',authController.forgotPassword)

// [POST] /auth/api/reset-password/
router.post('/api/reset-password',authController.resetPassword)

module.exports = router;