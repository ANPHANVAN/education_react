const Class = require('../models/classModel.js'); // Assuming you have a Class model defined
const Users = require('../models/userModel.js'); // Assuming you have a User model defined
const Students = require('../models/studentModel.js'); // Assuming you have a Student model defined
const mongoose = require('mongoose');
const Submissions = require('../models/submissionModel.js')
const Tests = require('../models/testModel.js')
const VideoRequirements = require('../models/videoRequirementModel.js')
const Essay = require('../models/essayModel.js')

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
            const userAddClass = await Users.findByIdAndUpdate(teacherId, { $push: { class_id: newClass._id } });
            if (!userAddClass) {
                res.status(404).json({message: "dont update class in user"})
            }
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

    // [GET] /class-teacher/classroom-details/:classId/test
    async classDetailsTest(req, res) {
        try {
            res.status(200).render('classTeacher/classroomDetailsTest')
        } catch(error) {
            console.error('Error fetching class details:', error);
            res.status(500).send('Internal Server Error')
        }
    }
    
    // [GET] /class-teacher/api/classroom-details/:classId/test
    async getClassDetailsTest(req, res) {
        try {
            const classId = req.params.classId
            const testLists = await Tests.find({class: classId},{answers:0})
            
            res.status(200).json({testLists:testLists})
        } catch(error) {
            console.error('Error fetching test class details:', error);
            res.status(500).send('Internal Server Error')
        }
    }

    // [GET] /class-teacher/classroom-details/:classId/video
    async classDetailsVideo(req,res){
        try {  
            res.status(200).render('classTeacher/classroomDetailsVideo')
        } catch (err) {
            console.error('Failure to engine ejs: ', err)
            res.status(500).send('Internal Server Error')
        }
    }
    
    // [GET] /class-teacher/api/classroom-details/:classId/video
    async getClassDetailsVideo(req,res){
        try {
            const classId = req.params.classId
            const videoClassList = await VideoRequirements.find({class: classId})
            res.status(200).json({videoClassList})
        } catch (err) {
            console.error('Failure to into route /class-teacher/api/classroom-details/:classId/video  :', err)
            res.status(500).send('Internal Server Error')

        }
    }
    // [GET] /class-teacher/classroom-details/:classId/announce
    async classDetailsAnnounce(req, res) {
        try {
            res.status(200).render('classTeacher/classroomDetailsAnnounce')
        } catch (err) {
            console.error('Failure to render ejs')
            res.status(500).send("Internal Server Error")
        }
    }
    
    // [GET] /class-teacher/api/classroom-details/:classId/announce
    async getClassDetailsAnnounce(req, res) {
        try {
            const classId = req.params.classId
            const classInfo = await Class.findById(classId)
            res.status(200).json(classInfo)
        } catch (err) {
            console.error('Failure to find class info in route /class-teacher/api/classroom-details/:classId/announce')
            res.status(500).send("Internal Server Error")
        }
    }

    // [POST] /class-teacher/api/classroom-details/:classId/announce
    async postClassDetailsAnnounce(req, res) {
        try {
            const classId = req.params.classId
            const { content } = req.body
            const classInfoUpdate = await Class.findByIdAndUpdate(classId, {
                $push: {
                    announcement: {content}
                }
            })

            res.status(200).json(classInfoUpdate)
        } catch (err) {
            console.error('')
            res.status(500).send("Internal Server Error")
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

            const userStudent = await Users.findOneAndUpdate({ email: studentEmail},{
                $push: {
                    class_id: classId
                }
            })
            if (!userStudent) {
                return res.status(404).send('Users with email not found');
            }

            const student = await Students.create({_id: student_id, student_user_id: userStudent._id, class_id: classId})
            if (!student) {
                return res.status(400).send('Failed to create student');
            }

            const classDetails = await Class.findByIdAndUpdate(
                classId,
                { 
                    $push: { 
                        students: { 
                            student_user_id: userStudent._id, 
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

            const studentInfo = await Students.findById(studentId)
            const userStudent = await Users.findOneAndUpdate({ _id: studentInfo.student_user_id},{
                $pull: {
                    class_id: classId
                }
            })

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


    // [GET] /class-teacher/classroom-details/:classId/essay
    async classDetailsEssay(req, res) {
        try {
            res.status(200).render('classTeacher/classroomDetailsEssay')
        } catch(error) {
            console.error('Error fetching class details:', error);
            res.status(500).send('Internal Server Error')
        }
    }
    
    // [GET] /class-teacher/api/classroom-details/:classId/essay
    async getClassDetailsEssay(req, res) {
        try {
            const classId = req.params.classId
            const essayLists = await Essay.find({class: classId})
            
            res.status(200).json({essayLists:essayLists})
        } catch(error) {
            console.error('Error fetching essay class details:', error);
            res.status(500).send('Internal Server Error')
        }
    }

}

module.exports = new ClassTeacherController();