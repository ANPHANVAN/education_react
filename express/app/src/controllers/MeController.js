const Users = require('../models/userModel.js')

class MeController {
    // GET /me
    async index(req, res) {
        const user_id = req.user.ObjectId
        res.redirect(`/me/${user_id}`)
    }
    // GET /me/:userId
    async userInformation(req, res) {
        const user_id = req.user.ObjectId
        res.render('mes/editUser');
    }

    // GET /me/api/get-user-info
    async getRole(req, res) {
        const userId = req.user.ObjectId
        const userInfo = await Users.findById(userId)
        if (!userInfo){
            res.status(404).json({message: 'Dont Found UserInfo'})
        }
        res.status(200).json({userInfo})
    }
}

module.exports = new MeController();