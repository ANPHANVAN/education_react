const express = require('express')
const router = express.Router()
const testTeacherController = require('../controllers/TestTeacher.Controller.js')

// [GET] /test-teacher/
router.get('/', testTeacherController.index)

// [GET] /test-teacher/upload-files-test
router.get('/upload-files-test', testTeacherController.uploadFileTests)

module.exports = router;