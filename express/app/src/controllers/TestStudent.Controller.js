const Tests = require('../models/testModel.js')
const Submissions = require('../models/submissionModel.js')

class TestStudentController {
    // [GET] /test-student/
    async index(req, res) {
        res.render('testStudent/indexTest');
    }

    // [GET] /test-student/test-information/:testId // this page display info before do test
    async testInformation(req, res) {
        try {
            res.render('testStudent/testInfo')
        } catch (error) {
            res.status(500).json({message: "An error in server", error: error})
        }
    }
    
    // [GET] /test-student/test/:testId  // this page is test page
    async getPageTest(req, res) {
        try {
            res.render('testStudent/doTest')
        } catch (error) {
            res.status(500).json({message: "An error in server", error: error})
        }
    }
    
    // [GET] /test-student/submit-info/:submissionId  // this page display score after do test page
    async getPageSubmission(req, res) {
        try {

        } catch (error) {
            res.status(500).json({message: "An error in server", error: error})
        }
    }
    
    
    ///////////////////////// API ////////////////////////////////
    // [GET] /test-student/api/test-information/:testId // this api get info to page info
    async getTestInformation(req, res) {
        try {
            const testId = req.params.testId
            const test = await Tests.findById(testId)
            if (!test) {
                res.status(404).json({message:"server dont find test"})
            }
            res.status(200).json(test)
        } catch (error) {
            res.status(500).json({message: "An error in server", error: error})
        }
    }
    
    // [POST] /test-student/api/test/:testId
    async postSubmitTest(req, res) {
        try {
            const testSubmit = req.body
            const student_id = req.student.student_id
            const testInfo = await Tests.findById(testSubmit.test_id)
            
            // caculate time do test
            const timeBegin = new Date(testSubmit.time_begin);
            const timeEnd = new Date(testSubmit.time_end);
            const durationMs = timeEnd - timeBegin;
            const durationInSeconds = Math.floor(durationMs / 1000);
            const durationInMinutes = Math.floor(durationInSeconds / 60);
            
            // caculator a score
            const answerTestInfo = testInfo.answers
            const answersStudent = testSubmit.student_answers
            let score = 0
            for (let i = 0; i < answerTestInfo.length; i++) {
                for (let j = 0; j < answersStudent.length; j++) {
                    if ( answerTestInfo[i].number == answersStudent[j].number ) {
                        if ( answerTestInfo[i].answer == answersStudent[j].answer ) {
                            score += answerTestInfo[i].score
                            break
                        }
                    }
                }
            }

            // assign value
            testSubmit.time_test = durationInMinutes
            testSubmit.student_id = student_id
            testSubmit.score = score
            
            const testSubmitInfo = await Submissions.create(testSubmit)
            res.status(200).json(testSubmitInfo)

        } catch (error) {
            res.status(500).json({message: "An error in server", error: error})
        }
    }
    
    // [GET] /test-student/api/submit-info/:submissionId  // take submission info for 
    async getInfoSubmission(req, res) {
        try {

        } catch (error) {
            res.status(500).json({message: "An error in server", error: error})
        }
    }
}

module.exports = new TestStudentController();