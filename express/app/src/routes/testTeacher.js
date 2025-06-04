const express = require('express')
const router = express.Router()
const testTeacherController = require('../controllers/TestTeacher.Controller.js')
const upload = require('../middleware/upload.js')

// [GET] /test-teacher/
router.get('/', testTeacherController.index)

// [GET] /test-teacher/upload-files-test
router.get('/upload-files-test', testTeacherController.uploadFileTests)

// [GET] /test-teacher/test-detail?test-id=:testId
router.get('/test-detail', testTeacherController.testDetail)

// [GET] /test-teacher/api/get-test-detail?test-id=:testId
router.get('/api/get-test-detail', testTeacherController.getTestDetail)

// [GET] /test-teacher/api/get-tests/
router.get('/api/get-tests/', testTeacherController.getTeacherTests)

// [POST] /test-teacher/api/upload-files-test
router.post('/api/upload-files-test', upload.single('testFile'), testTeacherController.postFileTests)

// [GET] /test-teacher/create-test?file=:filename
router.get('/create-test', testTeacherController.createTest)

// [POST] /test-teacher/api/create-test
router.post('/api/create-test', testTeacherController.postCreateTest)

module.exports = router;