const express = require('express');
const router = express.Router();
const classStudentController = require('../controllers/ClassStudent.Controller.js');
const setStudentInfo = require('../middleware/setStudentInfo.js');

/////////// API ///////////////
// [GET] /class-student/api/get-class-test?class_id=class_id
router.get('/api/get-class-test', setStudentInfo, classStudentController.getclassTest);

// [GET] /class-student/api/:class_id
router.get('/api/:class_id', classStudentController.getclassDetail);

// [GET] /class-student/student-video?class_id=class_id   //get student status video
router.get('/student-video', setStudentInfo, classStudentController.getStudentVideoStatus);

// [GET] /class-student/student-essay?class_id=class_id   //get student status essay
router.get('/student-essay', setStudentInfo, classStudentController.getStudentEssayStatus);

//////////// ROUTE /////////////
// [GET] /class-student/:class_id
router.get('/:class_id', classStudentController.classDetail);

// [GET] /class-student
router.get('/', classStudentController.index);

module.exports = router;
