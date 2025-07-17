const Tests = require('../models/testModel.js');
const Classes = require('../models/classModel.js');
const Submissions = require('../models/submissionModel.js');
const mongoose = require('mongoose');

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
      const tests = await Tests.find({ teacher_owner_id: teacherId }, { answers: 0 }).populate(
        'class',
        'class_name'
      );

      return res.status(200).json(tests);
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
        .populate('teacher_owner_id', 'fullname email');

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

      const deletedTest = await Tests.findOneAndDelete({
        _id: testId,
        teacher_owner_id: teacherId,
      });

      if (!deletedTest) {
        return res
          .status(404)
          .json({ message: 'Test not found or you do not have permission to delete it.' });
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
        return res.status(200).redirect(`/test-teacher/create-test?file=${req.file.filename}`);
      } else {
        return res.status(400).json({ message: 'No file uploaded' });
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
      const { title, testTime, subject, grade, urlFile, answers } = req.body;
      const teacherOwnerId = req.user._id;

      const sum_score = answers.reduce((sum, { score }) => sum + Number(score), 0);

      const newTest = await Tests.create({
        title: title,
        test_time: testTime,
        subject: subject,
        grade: grade,
        url_file: urlFile,
        answers: answers,
        teacher_owner_id: teacherOwnerId,
        sum_score: sum_score,
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

  // [GET] /test-teacher/api/get-classes  // this class take classes of teacher
  async getClasses(req, res) {
    try {
      const teacherId = req.user._id;
      const classes = await Classes.find({ teacher_id: teacherId });

      if (!classes || classes.length === 0) {
        return res.status(404).json({ message: 'No classes found for this teacher.' });
      }
      res.status(200).json(classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
      res.status(500).json({ message: 'An error occurred while fetching the classes.' });
    }
  }

  //[GET] /test-teacher/api/put-class-in-test   // this api to put class to test
  async putClass(req, res) {
    try {
      const { class_id, testId } = req.body;
      if (class_id.length === 0 || !testId) {
        return res.status(400).json({ message: 'Class ID and Test ID are required.' });
      }

      const putClass = await Tests.findOneAndUpdate(
        { _id: testId },
        { class: class_id },
        { new: true }
      );

      if (!putClass) {
        return res.status(404).json({ message: 'Test not found.' });
      }

      res.status(200).json({ message: 'Class added to test successfully.', test: putClass });
    } catch (error) {
      console.error('Error putting class to test:', error);
      res.status(500).json({ message: 'An error occurred while putting class to test.' });
    }
  }

  // [GET] /test-teacher/api/get-test-info-details?test-id=:testId
  async getTestInfoDetails(req, res) {
    try {
      const testId = req.query['test-id'];
      const classTestInfo = await Tests.findById(testId, { answers: 0 }).populate({
        path: 'class',
        select: '_id grade class_name number_student school_year createdAt students',
      });
      // const classSubmissionInfo = await Submissions.find({test_id: testId},{student_answers:0})

      res.status(200).json({ classTestInfo });
    } catch (err) {
      console.error(
        'Failure to get test info details in route /test-teacher/api/get-test-info-details: ',
        err
      );
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // [GET] /test-teacher/test-class-detail?test-id=:testId&class_id=classId
  async testClassDetail(req, res) {
    try {
      res.status(200).render('testTeacher/testClassDetail');
    } catch (err) {
      console.error(
        'Failure when render engine ejs with route /test-teacher/test-class-detail?test-id=:testId&class_id=classId:',
        err
      );
      res.status(500).send('Internal Server Error');
    }
  }

  // [GET] /test-teacher/api/test-class-detail?test-id=:testId&class_id=classId
  async getTestClassDetail(req, res) {
    try {
      const classId = req.query['class_id'];
      const testId = req.query['test-id'];
      const submissionInfo = await Submissions.find(
        { class_id: classId, test_id: testId },
        { student_answers: 0 }
      );
      const classInfo = await Classes.findById(classId, { announcement: 0 }).populate({
        path: 'students',
        populate: {
          path: 'student_user_id',
          select: 'fullname email',
        },
      });
      const testInfo = await Tests.findById(testId, { answers: 0 });
      res.status(200).json({ submissionInfo, classInfo, testInfo });
    } catch (err) {
      console.error(
        'Failure with route // [GET] /test-teacher/api/test-class-detail?test-id=:testId&class_id=classId',
        err
      );
      res.status(500).send('Internal Server Error');
    }
  }
}

module.exports = new TestTeacherController();
