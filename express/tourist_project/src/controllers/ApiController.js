const Users = require('../models/userModel');

class ApiController {
    // GET /api/user/all-user
    async apiAllUser(req, res) {
        try {
            let allUser = await Users.find({}).sort({ online_status: -1 });
            res.json({users: allUser})
        } catch (error) {
            console.error('Error fetching all users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // GET /api/user-current  take user current
    async apiUserCurrent(req, res) {
        try {
            const userId = req.user.ObjectId
            let user = await Users.findOne({_id: userId})
            res.json({user})
        } catch (error) {
            console.error('Error fetching current user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
  
}


module.exports = new ApiController()