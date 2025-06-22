const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/adminControllers.js')

// [POST] /admin/api/set-role
router.post('/api/set-role', adminControllers.setRole)

// [GET] /admin/find-user
router.get('/find-user',adminControllers.findUser)

// [GET] /admin/api/find-user
router.get('/api/find-user',adminControllers.getFindUser)

// [GET] /admin/api/get-one-user
router.get('/api/get-one-user',adminControllers.getOneUser)

// [GET] /admin
router.get('/',adminControllers.index)


module.exports = router;