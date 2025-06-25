const Users = require('../models/userModel.js');

const roleCheck = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "middleware can't find userId" });
    }
    const role = user.role;
    if (role == 'admin') {
      next();
    }
    return res.status(403).json({ message: 'You dont have admin permisson' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = roleCheck;
