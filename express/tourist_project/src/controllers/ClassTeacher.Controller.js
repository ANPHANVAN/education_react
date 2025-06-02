const Class = require('../models/classModel.js'); // Assuming you have a Class model defined
const Users = require('../models/userModel.js'); // Assuming you have a User model defined

class ClassTeacherController {
    async index(req, res) {
        try {
            // Render the class teacher page
            res.render('classTeacher/index');
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    // [POST] /class-teacher/api/create-class
    async createClass(req, res) {
        try {
            const _id = req.user.ObjectId;
            const { className, schoolYear, grade } = req.body;
            const newClass = await Class.create({class_name: className, school_year: schoolYear, grade: grade, teacher_id: [_id]});
            const teacherId = req.user.ObjectId; // Assuming the teacher's ID is stored in req.user
            await Users.findByIdAndUpdate(teacherId, { $push: { class_id: newClass._id } });
            res.status(201).json({ message: 'Class created successfully:', class: newClass });
        } catch (err) {
            console.error('Error creating class:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    // [GET] /class-teacher/api/get-teacher-class  // take all information of teacher + all classes of them
    async getClassTeacher(req, res) {
        try {
            const teacherId = req.user.ObjectId; 
            const userCurrentWithClass = await Users.find({ _id: teacherId }).populate('class_id', 'grade class_name number_student school_year');
            res.status(200).json(userCurrentWithClass);
        } catch (err) {
            console.error('Error fetching classes:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    ///////////////////////////////////// Classroom Details /////////////////////////////////////

    // [GET] /class-teacher/classroom-details/:classId
    async classDetails(req, res) {
        try {
            res.render('classTeacher/classroomDetails');
        } catch (err) {
            console.error('Error fetching class details:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    // [GET] /class-teacher/api/classroom-details/:classId
    async getClassDetails(req, res) {
        try {
            const classId = req.params.classId;
            const classDetails = await Class.findById(classId)
                .populate('student_id', 'fullname email')
                .populate('teacher_id', 'fullname email');
            if (!classDetails) {
                return res.status(404).send('Class not found');
            }
            res.status(200).json(classDetails);
        } catch (err) {
            console.error('Error fetching class details:', err);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = new ClassTeacherController();