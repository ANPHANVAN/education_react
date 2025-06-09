const Users = require('../models/userModel.js')

class HomeController {
    // [GET] /
    async index (req,res){
        try {
            res.render('home/homeIndex');
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    // [GET] /home-student
    async homeStudent (req,res){
        try {
            res.render('home/homeStudent')
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    /////////// API ////////////

    async getUserStudentClass(req,res) {
        try {
            const userId = req.user._id
            const userAndClassInfo = await Users.findById(userId)
                .populate({
                    path:'class_id',
                    select: 'grade class_name number_student school_year teacher_id announcement',
                    populate: {
                        path: 'teacher_id',
                        select: 'username fullname, email'
                    }
                })

            if (!userAndClassInfo) {
                res.status(404).json({message: "server dont find any class in this users"})
            }
            res.status(200).json(userAndClassInfo)

        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = new HomeController();