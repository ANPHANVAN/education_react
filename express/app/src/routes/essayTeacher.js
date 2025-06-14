const express = require('express');
const router = express.Router();
const essayTeacherController = require('../controllers/EssayTeacher.Controller.js');
const upload = require('../middleware/uploadEssay.js')

// ROUTE //
// [GET] /essay-teacher/upload-file-essay-test
router.get('/upload-file-essay-test', essayTeacherController.uploadFileEssay);

// [GET] /essay-teacher
router.get('/', essayTeacherController.index);

// [GET] /essay-teacher/essay-detail?essay-id=:essayId
router.get('/essay-detail', essayTeacherController.essayDetail)

// [GET] /essay-teacher/essay-class-detail?essay-id=:essayId&class_id=classId
router.get('/essay-class-detail', essayTeacherController.essayClassDetail)

// API //

// [POST] /essay-teacher/api/upload-file-essay-test
router.post('/api/upload-file-essay-test', upload.single('upload-essay'), essayTeacherController.postUploadFileEssay);

// [GET] /essay-teacher/api/get-my-essay
router.get('/api/get-my-essay', essayTeacherController.getMyEssay)

// [GET] /essay-teacher/api/get-essay-detail?essay-id=:essayId
router.get('/api/get-essay-detail', essayTeacherController.getEssayDetail)

//[GET] /essay-teacher/api/put-class-in-essay // this api to put class to essay
router.put('/api/put-class-in-essay', essayTeacherController.putClass)

// [DELETE] /essay-teacher/api/delete-essay/:essayId
router.delete('/api/delete-essay/:essayId', essayTeacherController.deleteEssay)

// [GET] /essay-teacher/api/essay-class-detail?essay-id=:essayId&class_id=classId
router.get('/api/essay-class-detail', essayTeacherController.getEssayClassDetail)

// [POST] /essay-teacher/api/teacher-give-evaluate?essay-submit-id=
router.post('/api/teacher-give-evaluate', essayTeacherController.postTeacherGiveEvaluate);
module.exports = router;