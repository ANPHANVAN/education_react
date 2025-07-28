const Users = require('../models/userModel.js');

class MeController {
  // GET /me
  async index(req, res) {
    try {
      const user_id = req.user.ObjectId;
      res.redirect(`/me/${user_id}`);
    } catch (error) {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    }
  }
  // GET /me/:userId
  async userInformation(req, res) {
    try {
      const user_id = req.user.ObjectId;
      res.render('mes/editUser');
    } catch (error) {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    }
  }

  // GET /me/api/get-user-info
  async getRole(req, res) {
    try {
      const userId = req.user.ObjectId;
      const userInfo = await Users.findById(userId);
      if (!userInfo) {
        res.status(404).json({ message: 'Dont Found UserInfo' });
      }
      res.status(200).json({ userInfo });
    } catch (error) {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    }
  }

  // [GET] /me/teacher-info/:teacherId
  async teacherInfo(req, res) {
    try {
      res.status(200).render('mes/teacherInfo');
    } catch (err) {
      console.error('engine dont load with route /me/teacher-info');
      res.status(500).send('Failure load teacher Info');
    }
  }

  // PUT /me/api/:id/edit
  async mePutEdit(req, res, next) {
    try {
      const updatedUser = await Users.findOneAndUpdate(
        { _id: req.user._id },
        { $set: req.body }, // chỉ update các trường có trong req.body
        { new: true } // trả về document đã được cập nhật
      );
      if (!updatedUser) {
        res.status(400).json({ message: 'update failure' });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    }
  }
}

module.exports = new MeController();
