const express = require('express');
const router = express.Router();

const siteController = require('../controllers/SiteController');
const authMiddleware = require('../middleware/authMiddleware')

// [GET] /login
router.get('/login', siteController.login)

// [GET] /logout
router.get('/logout', siteController.logout)

router.post('/login/authentication', siteController.authentication)

// [POST] /register-new
router.post('/register-new', siteController.registerNew)

// [GET] /register
router.get('/register', siteController.register)

// [GET] /health
router.get('/health', (req, res) => {
    res.status(200).send('OK');
});
router.use('/', authMiddleware, siteController.index)

module.exports = router;