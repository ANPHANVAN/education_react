const Users = require('../models/userModel.js');

class AdminController {
    async index(req,res){
        try {
            res.status(200).render('admin/indexAdmin');
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    // [POST] /admin/api/set-role
    async setRole(req,res){
        try {
            let { username, email, role } = req.body;
            username = username.trim().toLowerCase();
            const user = await Users.findOneAndUpdate({username, email},{
                $set: {
                    role: role
                }
            });

            if (!user){
                return res.status(404).json({message: "Failure update Role: username or email Wrong"})
            }
            res.status(200).json({message: "Update Role Success"})
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
        }        
    }


    // [GET] /admin/find-user (Hiển thị trang HTML)
    findUser = (req, res) => {
    res.status(200).render('admin/findUser'); // cần tạo file views/admin/find-user.ejs hoặc .html
    };

    // [GET] /admin/api/find-user?keyword=...
    getFindUser = async (req, res) => {
        try {
            const keyword = req.query.keyword?.trim();
            if (!keyword) {
            return res.status(400).json({ message: 'Thiếu từ khóa tìm kiếm' });
            }

            const regex = new RegExp(keyword, 'i'); // không phân biệt hoa thường
            const users = await Users.find({
            $or: [
                { username: { $regex: regex } },
                { email: { $regex: regex } }
            ],
            deleted: { $ne: true }
            })

            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', error: err.message });
        }
    };

    // [GET] /admin/api/get-one-user?id=...
    getOneUser = async (req, res) => {
        try {
            const userId = req.query.id;
            if (!userId) return res.status(400).json({ message: 'Thiếu ID người dùng' });

            const user = await Users.findById(userId).select('-password');

            if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', error: err.message });
        }
    };

}

module.exports = new AdminController();