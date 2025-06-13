const Class = require('../models/classModel.js'); // Assuming you have a Class model defined
const Users = require('../models/userModel.js'); // Assuming you have a User model defined
const Students = require('../models/studentModel.js'); // Assuming you have a Student model defined
const Tests = require('../models/testModel.js')
const VideoRequirements = require('../models/videoRequirementModel.js')
const Essay = require('../models/essayModel.js')
const EssaySubmit = require('../models/essaySubmitModels.js')

class EssayStudentController {
    async index(req, res) {
        try {
            // Render the class teacher page
            res.render('essayStudent/index');
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    // [GET] /essay-student/essay-information/:essayId // this page display info before do essay
    async essayInformation(req, res) {
        try {
            res.render('essayStudent/essayInfo')
        } catch (error) {
            res.status(500).json({message: "An error in server", error: error})
        }
    }

    // [GET] /essay-student/essay/:essayId  // this page is essay page
    async getPageEssay(req, res) {
        try {
            res.render('essayStudent/doEssay')
        } catch (error) {
            res.status(500).json({message: "An error in server", error: error})
        }
    }

    // API //

    // [GET] /essay-student/api/essay-information/:essayId // this api get info to page info
    async getEssayInformation(req, res) {
        try {
            const essayId = req.params.essayId
            const essay = await Essay.findById(essayId)
            if (!essay) {
                res.status(404).json({message:"server dont find essay"})
            }
            res.status(200).json(essay)
        } catch (error) {
            res.status(500).json({message: "An error in server", error: error})
        }
    }

  // [POST] /essay-student/api/essay/:essayId
    async postSubmitEssay(req, res) {
        try {
            const { filename } = req.file
            const { classId, subject, grade, essayId } = req.body;
            const student_id = req.student.student_id;
            
            // assign value
            const essaySubmit = {
                class_id : classId, 
                student_id: student_id,
                subject: subject, 
                grade: grade, 
                essay_id: essayId,
                url_file_submit: `/uploads/essay/student/${filename}`
            }
            console.log("essaySubmit",essaySubmit)
            const essaySubmitInfo = await EssaySubmit.create(essaySubmit);
            res.status(200).json(essaySubmitInfo);

        } catch (error) {
            console.error("Eror server ", error)
            res.status(500).json({message: "An error in server", error: error})
        }
    }
}

module.exports = new EssayStudentController();