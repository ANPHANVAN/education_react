const express = require('express');
const router = express.Router();
const classTeacherController = require('../controllers/ClassTeacher.Controller.js');

///////////////////////////////////// Classroom Details /////////////////////////////////////

// [GET] /class-teacher/classroom-details/:classId
router.get('/classroom-details/:classId', classTeacherController.classDetails )

// [GET] /class-teacher/api/classroom-details/:classId
router.get('/api/classroom-details/:classId', classTeacherController.getClassDetails )

// [PUT] /class-teacher/api/classroom-details/:classId
router.put('/api/classroom-details/:classId', classTeacherController.putClassDetails )

// [POST] /class-teacher/api/classroom-details/:classId/add-student
router.post('/api/classroom-details/:classId/add-student', classTeacherController.addStudentToClass )

// dont finish, need to delete student more information
// [DELETE] /class-teacher/api/classroom-details/:classId/delete-student
router.delete('/api/classroom-details/:classId/delete-student', classTeacherController.deleteStudentFromClass )


///////////////////////////////////// Index /class-teacher //////////////////////////////////
// [POST] /class-teacher/api/create-class
router.post('/api/create-class', classTeacherController.createClass);

// [GET] /class-teacher/api/get-teacher-class
router.get('/api/get-teacher-class', classTeacherController.getClassTeacher);

// [GET] /class-teacher
router.get('/', classTeacherController.index);

module.exports = router;