const express = require('express');
const router = express.Router();
const classStudentController = require('../controllers/ClassStudent.Controller.js');
const setStudentInfo = require('../middleware/setStudentInfo.js')

/////////// API ///////////////
// [GET] /class-student/api/get-class-test?class_id=class_id
router.get('/api/get-class-test', setStudentInfo, classStudentController.getclassTest);


// [GET] /class-student/api/:class_id
router.get('/api/:class_id', classStudentController.getclassDetail);


//////////// ROUTE /////////////
// [GET] /class-student/:class_id
router.get('/:class_id', classStudentController.classDetail);

// [GET] /class-student
router.get('/', classStudentController.index);

module.exports = router;