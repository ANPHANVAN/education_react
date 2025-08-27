const Classes = require('../models/classModel.js'); // Assuming you have a Class model defined
const Tests = require('../models/testModel.js');
const Submissions = require('../models/submissionModel.js');
const VideoRequirements = require('../models/videoRequirementModel.js');
const Students = require('../models/studentModel.js');
const Essay = require('../models/essayModel.js');
const Users = require('../models/userModel.js');

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
  async classDetail(req, res) {
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
      const class_id = req.params.class_id;
      const classInfo = await Classes.findById(class_id);
      if (!classInfo) {
        res.status(404).json({ message: 'server dont found this class' });
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
      const class_id = req.student.class_id;
      const student_id = req.student.student_id;
      const userId = req.user._id;
      const testDocs = await Tests.find({ class: class_id });

      const submitList = await Submissions.find(
        { class_id: class_id, student_id: student_id },
        { student_answers: 0 }
      );

      let studentTest = {
        student_id: student_id,
        tests: [],
      };
      for (let i = 0; i < testDocs.length; i++) {
        let found = false;
        for (let j = 0; j < submitList.length; j++) {
          if (testDocs[i]._id.toString() === submitList[j].test_id.toString()) {
            studentTest.tests.push({
              test_id: testDocs[i]._id,
              test_title: testDocs[i].title,
              test_status_submit: true,
              score: submitList[j].score,
              sum_score: testDocs[j].sum_score,
              time_end: submitList[j].time_end,
              time_test: submitList[j].time_test,
            });

            found = true;
            break;
          }
        }
        if (!found) {
          studentTest.tests.push({
            test_id: testDocs[i]._id,
            test_title: testDocs[i].title,
            test_status_submit: false,
            score: null,
            sum_score: null,
            time_end: null,
            time_test: null,
          });
        }
      }
      res.json(studentTest);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  async getStudentVideoStatus(req, res) {
    try {
      const class_id = req.student.class_id;
      const student_id = req.student.student_id;

      const videoClassInfo = await VideoRequirements.find({ class: class_id });
      const studentVideoInfo = await Students.findById(student_id).populate({
        path: 'video',
      });
      res.status(200).json({ videoClassInfo, studentVideoInfo, student_id });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  // [GET] /class-student/student-essay?class_id=class_id   //get student status essay
  async getStudentEssayStatus(req, res) {
    try {
      const class_id = req.student.class_id;
      const student_id = req.student.student_id;

      const essayClassInfo = await Essay.find({ class: class_id });
      const studentEssayInfo = await Students.findById(student_id).populate({
        path: 'essay',
      });
      res.status(200).json({ essayClassInfo, studentEssayInfo, student_id });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  // [GET] /class-student/api/classroom-details/get-teacher-info/:classId
  async getTeacherInfo(req, res) {
    try {
      const classId = req.params.classId;
      const classInfo = await Classes.findById(classId);
      if (!classInfo) {
        return res.status(404).json({ message: 'Class not found' });
      }

      const userCurrent = await Users.findById(classInfo.teacher_id[0]);
      if (!userCurrent) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(userCurrent.teacher_info || {});
    } catch (error) {
      console.error('Error fetching teacher info:', error);
      res.status(500).send('Internal Server Error');
    }
  }
}

module.exports = new ClassTeacherController();
