class MeController {
    // GET /me
    async index(req, res) {
        const user_id = req.user.ObjectId
        res.render('mes/me', { user_id: user_id });
    }
}

module.exports = new MeController();