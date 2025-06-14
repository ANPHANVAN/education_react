const express = require('express');
const router = express.Router();
const essayStudentController = require('../controllers/EssayStudent.Controller.js');
const studentUpload = require('../middleware/studentUploadEssay.js')
const setStudentInfo = require('../middleware/setStudentInfo.js')

// ROUTE //
// Alway have ?class_id=

// [GET] /essay-teacher
router.get('/', essayStudentController.index);

// [GET] /essay-student/essay-information/:essayId // this page display info before do essay
router.get('/essay-information/:essayId', essayStudentController.essayInformation)

// [GET] /essay-student/essay/:essayId  // this page is essay page
router.get('/essay/:essayId', essayStudentController.getPageEssay)


// API //
// [GET] /essay-student/api/essay-information/:essayId // this api get info to page info   no answers
router.get('/api/essay-information/:essayId', essayStudentController.getEssayInformation)



// [POST] /essay-student/api/essay/:essayId?class_id=
router.post('/api/essay/:essayId',setStudentInfo, studentUpload.single('submitEssay'), essayStudentController.postSubmitEssay)

module.exports = router;