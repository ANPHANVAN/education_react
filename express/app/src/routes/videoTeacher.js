const express = require('express')
const router = express.Router()
const videoTeacherController = require('../controllers/VideoTeacher.Controller.js')

///////////////////////// VIEW ROUTES/////////////////////////
// [GET] /video-teacher/
router.get('/', videoTeacherController.index)

// [GET] /video-teacher/create-video
router.get('/create-video', videoTeacherController.getCreateVideo)

// [GET] /video-teacher/video-detail/:videoId
router.get('/video-detail/:videoId', videoTeacherController.getDetailVideo)


///////////////////////// API ROUTES /////////////////////////

// [POST] /video-teacher/api/create-video
router.post('/api/create-video', videoTeacherController.postCreateVideo)

// [GET] /video-teacher/api/get-video  // get video of teacher
router.get('/api/get-video', videoTeacherController.getVideo)

// [GET] /video-teacher/api/get-classes  // this class take classes of teacher
router.get('/api/get-classes', videoTeacherController.getClasses)

// [GET] /video-teacher/api/video-detail/:videoId
router.get('/api/video-detail/:videoId', videoTeacherController.getApiDetailVideo)

// [DELETE] /video-teacher/api/delete-video/:videoId
router.delete('/api/delete-video/:videoId', videoTeacherController.deleteApiDetailVideo)

//[PUT] /video-teacher/api/put-class-in-video // this api to put class to video
router.put('/api/put-class-in-video', videoTeacherController.putClassInVideo)

module.exports = router;