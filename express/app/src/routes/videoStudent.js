const express = require('express')
const router = express.Router()
const videoStudentController = require('../controllers/VideoStudent.Controller.js')

///////////////////////// VIEW ROUTES/////////////////////////
// [GET] /video-student/
router.get('/', videoStudentController.index)

// [GET] /video-student/watch-video/:videoRequirementId?student_id=StudentId  route video student by id
router.get('/watch-video/:videoRequirementId', videoStudentController.watchVideoRequirement)

// [GET] /video-student/api/watch-video/:videoRequirementId  route video student by id
router.get('/api/watch-video/:videoRequirementId', videoStudentController.getVideoInfo)

// [POST] /video-student/api/finish-video
router.post('/api/finish-video', videoStudentController.createFinishVideo)

module.exports = router;