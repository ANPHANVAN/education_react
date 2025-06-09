const express = require('express');
const router = express.Router();

const homeController = require('../controllers/Home.Controller.js')

//////////////// API ////////////////

// [GET] /home-student/get-user-student-classes
router.use('/home-student/get-user-student-classes', homeController.getUserStudentClass)


//////////////// ROUTE //////////////
// [GET] /home-student
router.use('/home-student', homeController.homeStudent)

// [GET] /
router.use('/', homeController.index)

module.exports = router;