const express = require('express')
const router = express.Router()
const testTeacherController = require('../controllers/TestTeacher.Controller.js')
const upload = require('../middleware/upload.js')

///////////////////////// VIEW ROUTES/////////////////////////
// [GET] /test-teacher/
router.get('/', testTeacherController.index)

// [GET] /test-teacher/upload-files-test
router.get('/upload-files-test', testTeacherController.uploadFileTests)

// [GET] /test-teacher/test-detail?test-id=:testId
router.get('/test-detail', testTeacherController.testDetail)

// [GET] /test-teacher/create-test?file=:filename
router.get('/create-test', testTeacherController.createTest)


////////////////////////API ROUTES////////////////////////
// [GET] /test-teacher/api/get-test-detail?test-id=:testId
router.get('/api/get-test-detail', testTeacherController.getTestDetail)

// [DELETE] /test-teacher/api/delete-test/:testId
router.delete('/api/delete-test/:testId', testTeacherController.deleteTest)

// [GET] /test-teacher/api/get-tests/
router.get('/api/get-tests/', testTeacherController.getTeacherTests)

// [POST] /test-teacher/api/upload-files-test
router.post('/api/upload-files-test', upload.single('testFile'), testTeacherController.postFileTests)

// [POST] /test-teacher/api/create-test
router.post('/api/create-test', testTeacherController.postCreateTest)

// [GET] /test-teacher/api/get-classes  // this class take classes of teacher
router.get('/api/get-classes', testTeacherController.getClasses)

//[GET] /test-teacher/api/put-class-in-test // this api to put class to test
router.put('/api/put-class-in-test', testTeacherController.putClass)

module.exports = router;