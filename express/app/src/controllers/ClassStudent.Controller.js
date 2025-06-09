const Classes = require('../models/classModel.js'); // Assuming you have a Class model defined
const Users = require('../models/userModel.js'); // Assuming you have a User model defined
const Students = require('../models/studentModel.js'); // Assuming you have a Student model defined
const Tests = require('../models/testModel.js')
const Submissions = require('../models/submissionModel.js')

class ClassTeacherController {
    async index(req, res) {
        try {
            // Render the class teacher page
            res.render('classStudent/index');
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    // [GET] /class-student/:class_id
    async classDetail(req,res) {
        try {
            // Render the class teacher page
            res.render('classStudent/detailClass');
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    /////////////// API //////////////
    // [GET] /class-student/api/:class_id
    async getclassDetail(req, res) {
        try {
            const class_id = req.params.class_id
            const classInfo = await Classes.findById(class_id)
            if ( !classInfo ) {
                res.status(404).json({message:"server dont found this class"})
            }
            res.status(200).json(classInfo);
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    // [GET] /class-student/api/get-class-test?class_id=class_id
    async getclassTest(req, res) {
        try {
            const class_id = req.student.class_id
            const student_id = req.student.student_id
            const userId = req.user._id
            const testDocs = await Tests.find({ class: class_id })

            const submitList = await Submissions.find({class_id:class_id, student_id:student_id})
            
            let studentTest = { 
                student_id:student_id,
                tests:[]
            }
            for (let i = 0; i < testDocs.length; i++) {
                for (let j = 0; j < submitList.length; j++) {
                    if ( testDocs[i]==submitList[j] ) {
                        studentTest.tests.push({test_id:testDocs[i]._id, 
                            test_title: testDocs[i].title,
                            score: submitList[j].score,
                            test_status_submit:true})
                        break
                    }
                }
                studentTest.tests.push({test_id:testDocs[i]._id, 
                    test_title: testDocs[i].title,
                    test_status_submit:false})
            }
            res.json(studentTest)

            
        } catch(error) {
            console.error('Error fetching data:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = new ClassTeacherController();