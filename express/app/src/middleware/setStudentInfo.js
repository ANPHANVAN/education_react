const Students = require('../models/studentModel.js');

const setStudentInfo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let classId;

    if (req.params.classId) {
      classId = req.params.classId;
    } else if (req.query['class-id']) {
      classId = req.query['class-id'];
    } else if (req.query['class_id']) {
      classId = req.query['class_id'];
    } else {
      res.status(400).json({ message: 'must have class-id or class_id or /:classId' });
    }

    const student = await Students.findOne({ student_user_id: userId, class_id: classId });

    if (!student) {
      res
        .status(404)
        .json({ message: "middleware can't find studentId for this user in this class" });
      return;
    }

    req.student = {
      student_id: student._id,
      class_id: student.class_id,
    };

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = setStudentInfo;
