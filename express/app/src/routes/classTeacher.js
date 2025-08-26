const express = require('express');
const router = express.Router();
const classTeacherController = require('../controllers/ClassTeacher.Controller.js');
const uploadTeacherInfo = require('../middleware/uploadTeacherInfo.js');

///////////////////////////////////// Classroom Details /////////////////////////////////////

// [GET] /class-teacher/classroom-details/:classId/test
router.get('/classroom-details/:classId/test', classTeacherController.classDetailsTest);

// [GET] /class-teacher/api/classroom-details/:classId/test
router.get('/api/classroom-details/:classId/test', classTeacherController.getClassDetailsTest);

// [GET] /class-teacher/classroom-details/:classId/video
router.get('/classroom-details/:classId/video', classTeacherController.classDetailsVideo);

// [GET] /class-teacher/api/classroom-details/:classId/video
router.get('/api/classroom-details/:classId/video', classTeacherController.getClassDetailsVideo);

// [GET] /class-teacher/classroom-details/:classId/announce
router.get('/classroom-details/:classId/announce', classTeacherController.classDetailsAnnounce);

// [GET] /class-teacher/api/classroom-details/:classId/announce
router.get(
  '/api/classroom-details/:classId/announce',
  classTeacherController.getClassDetailsAnnounce
);

// [POST] /class-teacher/api/classroom-details/:classId/announce
router.post(
  '/api/classroom-details/:classId/announce',
  classTeacherController.postClassDetailsAnnounce
);

// [GET] /class-teacher/classroom-details/:classId/essay
router.get('/classroom-details/:classId/essay', classTeacherController.classDetailsEssay);

// [GET] /class-teacher/api/classroom-details/:classId/essay
router.get('/api/classroom-details/:classId/essay', classTeacherController.getClassDetailsEssay);

// teacher info update
// [GET] /class-teacher/api/classroom-details/get-teacher-info/:classId
router.get(
  `/api/classroom-details/get-teacher-info/:classId`,
  classTeacherController.getTeacherInfo
);
// [POST] /class-teacher/api/classroom-details/createTeacherInfo/:classId
router.post(
  '/api/classroom-details/createTeacherInfo/:classId',
  uploadTeacherInfo.single('teacherPhoto'),
  classTeacherController.createTeacherInfo
);

/////////////////////////////////////////////////////////////////

// [GET] /class-teacher/classroom-details/:classId
router.get('/classroom-details/:classId', classTeacherController.classDetails);

// [GET] /class-teacher/api/classroom-details/:classId
router.get('/api/classroom-details/:classId', classTeacherController.getClassDetails);

// [PUT] /class-teacher/api/classroom-details/:classId
router.put('/api/classroom-details/:classId', classTeacherController.putClassDetails);

// [POST] /class-teacher/api/classroom-details/:classId/add-student
router.post(
  '/api/classroom-details/:classId/add-student',
  classTeacherController.addStudentToClass
);

// [DELETE] /class-teacher/api/classroom-details/:classId/delete-student
router.delete(
  '/api/classroom-details/:classId/delete-student',
  classTeacherController.deleteStudentFromClass
);

///////////////////////////////////// Index /class-teacher //////////////////////////////////
// [POST] /class-teacher/api/create-class
router.post('/api/create-class', classTeacherController.createClass);

// [GET] /class-teacher/api/get-teacher-class
router.get('/api/get-teacher-class', classTeacherController.getClassTeacher);

// [DELETE] /class-teacher/api/delete-class
router.delete('/api/delete-class', classTeacherController.deleteClassTeacher);

// [PUT] /class-teacher/api/rename-class
router.put('/api/rename-class', classTeacherController.renameClassTeacher);

// [GET] /class-teacher
router.get('/', classTeacherController.index);

module.exports = router;
