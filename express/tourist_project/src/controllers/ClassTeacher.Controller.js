const Class = require('../models/classModel.js'); // Assuming you have a Class model defined
const Users = require('../models/userModel.js'); // Assuming you have a User model defined
const Students = require('../models/studentModel.js'); // Assuming you have a Student model defined
const mongoose = require('mongoose');

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
                .populate('students.student_user_id', 'fullname email')
                .populate('students.student_id', 'registration_number')
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

    // [PUT] /class-teacher/api/classroom-details/:classId
    async putClassDetails(req, res) {
        try {
            const classId = req.params.classId;
            const { className, schoolYear, grade } = req.body;

            const updatedClass = await Class.findByIdAndUpdate(
                classId,
                { class_name: className, school_year: schoolYear, grade: grade },
                { new: true }
            );

            if (!updatedClass) {
                return res.status(404).send('Class not found');
            }

            res.status(200).json({ message: 'Class updated successfully', class: updatedClass });
        } catch (err) {
            console.error('Error updating class details:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    // [POST] /class-teacher/api/classroom-details/:classId/add-student  // add student from studentUserId
    async addStudentToClass(req, res) {
        try {
            const { studentEmail } = req.body;
            const classId = req.params.classId;
            const student_id = new mongoose.Types.ObjectId();

            const userStudent = await Users.find({ email: studentEmail})
            if (userStudent.length === 0) {
                return res.status(404).send('Users with email not found');
            }

            const student = await Students.create({_id: student_id, student_user_id: userStudent[0]._id, class_id: classId})
            if (!student) {
                return res.status(400).send('Failed to create student');
            }

            const classDetails = await Class.findByIdAndUpdate(
                classId,
                { 
                    $push: { 
                        students: { 
                            student_user_id: userStudent[0]._id, 
                            student_id: student_id 
                        } 
                    },
                    $inc: { number_student: +1 } 
                },
                { new: true }
            )

            if (!classDetails) {
                return res.status(404).send('Class not found');
            }

            res.status(200).json({ message: 'Student added to class successfully: ', studentEmail });
        } catch (err) {
            console.error('Error adding student to class:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    // dont finish, need to delete student more information
    // [DELETE] /class-teacher/api/classroom-details/:classId/delete-student
    async deleteStudentFromClass(req, res) {
        try {
            const { studentId } = req.body;
            const classId = req.params.classId;

            const student = await Students.findOneAndDelete({ _id: studentId, class_id: classId });
            if (!student) {
                return res.status(404).send('Student not found in this class');
            }

            const classDetails = await Class.findByIdAndUpdate(
                classId,
                { $pull: { students: { student_id: studentId } },
                  $inc: { number_student: -1 } },
                { new: true }
            );

            if (!classDetails) {
                return res.status(404).send('Class not found');
            }

            res.status(200).json({ message: 'Student deleted from class successfully', studentId });
        } catch (err) {
            console.error('Error deleting student from class:', err);
            res.status(500).send('Internal Server Error');
        }
    }

}

module.exports = new ClassTeacherController();