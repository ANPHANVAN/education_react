const Class = require('../models/classModel.js'); // Assuming you have a Class model defined
const Users = require('../models/userModel.js'); // Assuming you have a User model defined
const Students = require('../models/studentModel.js'); // Assuming you have a Student model defined
const Tests = require('../models/testModel.js');
const VideoRequirements = require('../models/videoRequirementModel.js');
const Essay = require('../models/essayModel.js');
const EssaySubmit = require('../models/essaySubmitModels.js');

class ClassTeacherController {
  async index(req, res) {
    try {
      // Render the class teacher page
      res.render('essayTeacher/index');
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Internal Server Error');
    }
  }

  // [GET] /essay-teacher/upload-file-essay-test
  async uploadFileEssay(req, res) {
    try {
      res.render('essayTeacher/uploadFiles');
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Internal Server Error');
    }
  }

  // [GET] /essay-teacher/essay-detail?essay-id=:essayId
  async essayDetail(req, res) {
    try {
      res.render('essayTeacher/essayDetail');
    } catch (error) {
      console.error('Error fetching essay details:', error);
      res.status(500).json({ message: 'An error occurred while fetching the essay details.' });
    }
  }

  // [GET] /essay-teacher/essay-class-detail?essay-id=:essayId&class_id=classId
  async essayClassDetail(req, res) {
    try {
      res.status(200).render('essayTeacher/essayClassDetail');
    } catch (err) {
      console.error(
        'Failure when render engine ejs with route /essay-teacher/essay-class-detail?essay-id=:essayId&class_id=classId:',
        err
      );
      res.status(500).send('Internal Server Error');
    }
  }

  // API //

  // [POST] /essay-teacher/upload-file-essay-test
  async postUploadFileEssay(req, res) {
    try {
      const userId = req.user._id;
      const { fieldname, originalname, encoding, mimetype, destination, filename } = req.file;
      const { title, grade, subject } = req.body;

      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
      }
      const createEssay = await Essay.create({
        title: title,
        url_file: `/uploads/essay/${filename}`,
        file_origin_name: originalname,
        grade: grade,
        subject: subject,
        teacher_owner_id: userId,
      });
      if (!createEssay) {
        res.status(400).json({ message: 'Dont create essay, you must enough infomation and file' });
      }
      res.status(200).redirect('/essay-teacher');
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'An error occurred while uploading the file.' });
    }
  }

  // [GET] /essay-teacher/api/get-my-essay
  async getMyEssay(req, res) {
    try {
      const userId = req.user._id;
      const essayList = await Essay.find({ teacher_owner_id: userId }).populate({
        path: 'class',
        select: 'class_name',
      });
      if (!essayList) {
        res.status(404).json({ message: 'Dont find any essay from this user' });
      }
      res.status(200).json(essayList);
    } catch (err) {
      console.error('Error fetching get-my-essay', err);
      res.status(500).send('Internal Server Error');
    }
  }

  // [GET] /essay-teacher/api/get-essay-detail?essay-id=:essayId
  async getEssayDetail(req, res) {
    try {
      const teacherId = req.user._id;
      const essayId = req.query['essay-id'];
      const essayList = await Essay.findOne({ _id: essayId, teacher_owner_id: teacherId })
        .populate('teacher_owner_id', 'fullname email')
        .populate({
          path: 'class',
          select: '_id grade class_name number_student school_year createdAt students',
        });
      if (!essayList) {
        return res
          .status(404)
          .json({ message: 'essayList not found or you do not have permission to access it.' });
      }

      res.status(200).json(essayList);
    } catch (error) {
      console.error('Error fetching essayList details:', error);
      res.status(500).json({ message: 'An error occurred while fetching the essayList details.' });
    }
  }

  //[GET] /essay-teacher/api/put-class-in-essay   // this api to put class to essay
  async putClass(req, res) {
    try {
      const { class_id, essayId } = req.body;
      if (class_id.length === 0 || !essayId) {
        return res.status(400).json({ message: 'Class ID and Essay ID are required.' });
      }

      const putClass = await Essay.findOneAndUpdate(
        { _id: essayId },
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

  // [DELETE] /essay-teacher/api/delete-essay/:essayId
  async deleteEssay(req, res) {
    try {
      const teacherId = req.user._id;
      const essayId = req.params.essayId;

      const deletedEssay = await Essay.findOneAndDelete({
        _id: essayId,
        teacher_owner_id: teacherId,
      });

      if (!deletedEssay) {
        return res
          .status(404)
          .json({ message: 'Essay not found or you do not have permission to delete it.' });
      }

      res.status(200).json({ message: 'Essay deleted successfully.', essay: deletedEssay });
    } catch (error) {
      console.error('Error deleting test:', error);
      res.status(500).json({ message: 'An error occurred while deleting the test.' });
    }
  }

  // [GET] /essay-teacher/api/essay-class-detail?essay-id=:essayId&class_id=classId
  async getEssayClassDetail(req, res) {
    try {
      const classId = req.query['class_id'];
      const essayId = req.query['essay-id'];
      const essaySubmitInfo = await EssaySubmit.find({ class_id: classId, essay_id: essayId });
      const classInfo = await Class.findById(classId, { announcement: 0 }).populate({
        path: 'students',
        populate: {
          path: 'student_user_id',
          select: 'fullname email',
        },
      });
      const essayInfo = await Essay.findById(essayId);
      res.status(200).json({ essaySubmitInfo, classInfo, essayInfo });
    } catch (err) {
      console.error(
        'Failure with route // [GET] /test-teacher/api/test-class-detail?test-id=:essayId&class_id=classId',
        err
      );
      res.status(500).send('Internal Server Error');
    }
  }

  // [POST] /essay-teacher/api/teacher-give-evaluate?essay-submit-id=
  async postTeacherGiveEvaluate(req, res) {
    try {
      const essaySubmitId = req.query['essay-submit-id'];
      const { score, comments } = req.body;

      if (!score || !comments) {
        res.status(400).json({ message: 'Must post with score and comments' });
      }
      const essaySubmit = await EssaySubmit.findByIdAndUpdate(
        essaySubmitId,
        { score: score, comments: comments },
        { new: true, runValidators: true }
      );
      if (!essaySubmit) {
        throw new Error('Essay not found');
      }
      res.status(200).json({ success: true, essaySubmit: essaySubmit });
    } catch (err) {
      console.error('Failure with route [POST] /essay-teacher/api/teacher-give-evaluate', err);
      res.status(500).send('Internal Server Error');
    }
  }
}

module.exports = new ClassTeacherController();
