const express = require('express');
const router = express.Router();

const homeController = require('../controllers/Home.Controller.js')

//////////////// ROUTE //////////////
// [GET] /home-student
router.get('/home-student', homeController.homeStudent)

// [GET] /home-teacher
router.get('/home-teacher', homeController.homeTeacher)

//////////////// API ////////////////

// [GET] /home-student/get-user-student-classes
router.get('/home-student/get-user-student-classes', homeController.getUserStudentClass)


// [GET] /
router.get('/', homeController.index)

module.exports = router;