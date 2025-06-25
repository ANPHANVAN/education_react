const express = require('express');
const router = express.Router();
const testStudentController = require('../controllers/TestStudent.Controller.js');

///////////////////////// VIEW ROUTES/////////////////////////
// !!!! All route must have querry class_id=
// [GET] /test-student/
router.get('/', testStudentController.index);

// [GET] /test-student/test-information/:testId // this page display info before do test
router.get('/test-information/:testId', testStudentController.testInformation);

// [GET] /test-student/test/:testId  // this page is test page
router.get('/test/:testId', testStudentController.getPageTest);

// [GET] /test-student/submit-info/:submissionId  // this page display score after do test page
router.get('/submit-info/:submissionId', testStudentController.getPageSubmission);

///////////////////////// API ////////////////////////////////
// [GET] /test-student/api/test-information/:testId // this api get info to page info   no answers
router.get('/api/test-information/:testId', testStudentController.getTestInformation);

// [POST] /test-student/api/test/:testId
router.post('/api/test/:testId', testStudentController.postSubmitTest);

// [GET] /test-student/api/submit-info/:submissionId  // take submission info for
router.get('/api/submit-info/:submissionId', testStudentController.getInfoSubmission);

module.exports = router;
