const Students = require('../models/studentModel.js');

const setStudentInfo = async (req, res, next) => {
    try {
        const userId = req.user._id;
        let classId;

        if (req.params.classId) {
            classId = req.params.classId;
        } else {
            classId = req.query['class-id'];
        }

        console.log("classId", classId);
        console.log("userId", userId)
        const student = await Students.findOne({ student_user_id: userId, class_id: classId });

        if (!student) {
            return res.status(404).json({ message: "middleware can't find studentId for this user in this class" });
        }

        req.student = {
            student_id: student._id,
            class_id: student.class_id
        };

        next();

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports = setStudentInfo;
