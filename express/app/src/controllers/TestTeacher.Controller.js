const Tests = require('../models/testModel.js');

class TestTeacherController {
    // [GET] /test-teacher/
    async index(req, res) {
        res.render('testTeacher/index');
    }

    // [GET] /test-teacher/upload-files-test
    async uploadFileTests(req, res) {
        res.render('testTeacher/uploadFiles');
    }

    // [GET] /test-teacher/test-detail?test-id=:testId
    async testDetail(req, res) {
        try {
            res.render('testTeacher/testDetail');
        } catch (error) {
            console.error('Error fetching test details:', error);
            res.status(500).json({ message: 'An error occurred while fetching the test details.' });
        }
    }

    // [GET] /test-teacher/api/get-tests
    async getTeacherTests(req, res) {
        try {
            const teacherId = req.user._id;
            const tests = await Tests.find({ teacher_owner_id: teacherId },{answers: 0})
            .populate('class.class_id', 'class_name')

            if (!tests || tests.length === 0) {
                return res.status(404).json({ message: 'No tests found for this teacher.' });
            }
            res.status(200).json(tests);
        } catch (error) {
            console.error('Error fetching tests:', error);
            res.status(500).json({ message: 'An error occurred while fetching the tests.' });
        }
    }

    // [GET] /test-teacher/api/get-test-detail?test-id=:testId
    async getTestDetail(req, res) {
        try {
            const teacherId = req.user._id;
            const testId = req.query['test-id'];
            const test = await Tests.findOne({ _id: testId, teacher_owner_id: teacherId }, { answers: 0 })
                .populate('class.class_id')
                .populate('teacher_owner_id', 'fullname email')

            if (!test) {
                return res.status(404).json({ message: 'Test not found or you do not have permission to access it.' });
            }

            res.status(200).json(test);
            
        } catch (error) {
            console.error('Error fetching test details:', error);
            res.status(500).json({ message: 'An error occurred while fetching the test details.' });
        }
    }

    // [DELETE] /test-teacher/api/delete-test/:testId
    async deleteTest(req, res) {
        try {
            const teacherId = req.user._id;
            const testId = req.params.testId;

            const deletedTest = await Tests.findOneAndDelete({ _id: testId, teacher_owner_id: teacherId });

            if (!deletedTest) {
                return res.status(404).json({ message: 'Test not found or you do not have permission to delete it.' });
            }

            res.status(200).json({ message: 'Test deleted successfully.', test: deletedTest });
        } catch (error) {
            console.error('Error deleting test:', error);
            res.status(500).json({ message: 'An error occurred while deleting the test.' });
        }
    }

    // [POST] /test-teacher/api/upload-files-test
    async postFileTests(req, res) {
        try {
            if (req.file) {
                console.log('File uploaded:', req.file);
                res.redirect(`/test-teacher/create-test?file=${req.file.filename}`);
            } else {
                res.status(400).json({ message: 'No file uploaded' });
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            res.status(500).json({ message: 'An error occurred while uploading the file.' });
        }
    }

    // [GET] /test-teacher/create-test?file=:filename
    async createTest(req, res) {
        try {
            res.render('testTeacher/createTest');
        } catch (error) {
            console.error('Error creating test:', error);
            res.status(500).json({ message: 'An error occurred while creating the test.' });
        }
    }

    // [POST] /test-teacher/api/create-test
    async postCreateTest(req, res) {
        try {
            const {title, testTime, subject, grade, urlFile, answers} = req.body;
            const teacherOwnerId = req.user._id;

            const newTest = await Tests.create({
                title: title,
                test_time: testTime,
                subject: subject,
                grade: grade,
                url_file: urlFile,
                answers: answers,
                teacher_owner_id: teacherOwnerId
            });

            if (!newTest) {
                return res.status(400).json({ message: 'Failed to create test.' });
            }
            res.status(200).json({ message: 'Test created successfully.', test: newTest });
        } catch (error) {
            console.error('Error creating test:', error);
            res.status(500).json({ message: 'An error occurred while creating the test.' });
        }
    }
}

module.exports = new TestTeacherController();