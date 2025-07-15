const HASH_SALT = Number(process.env.HASH_SALT);
const JWT_SECRET = process.env.JWT_SECRET;
const UserSecurity = require('../models/userSecurityModel');
const jwt = require('jsonwebtoken');
const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const OtpReset = require('../models/otpResetModel.js');
const nodemailer = require('nodemailer');

const FINAL_HOST = process.env.FINAL_HOST; // example http://web.com
const domain = FINAL_HOST.split('//')[1];
const GMAIL = process.env.GMAIL;
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${GMAIL}`,
    pass: `${GMAIL_PASSWORD}`,
  },
});

class AuthController {
  async index(req, res) {
    try {
      res.render('sites/home');
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Internal Server Error');
    }
  }

  async login(req, res, next) {
    try {
      res.render('sites/login');
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Internal Server Error');
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie('token');
      res.redirect('/auth/login');
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Internal Server Error');
    }
  }

  async register(req, res, next) {
    try {
      res.render('sites/register');
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Internal Server Error');
    }
  }

  // [GET] /auth/forgot-password
  async forgotPasswordPage(req, res) {
    try {
      res.render('sites/getOTP');
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Internal Server Error');
    }
  }

  // [POST] /auth/register-new
  async registerNew(req, res, next) {
    try {
      let registerInformation = req.body;
      let { confirmPassword, ...userData } = registerInformation;

      userData.username = userData.username.trim().toLowerCase();
      userData.email = userData.email.trim().toLowerCase();

      // Kiểm tra username hoặc email đã tồn tại
      let existingUser = await Users.findOne({
        $or: [{ username: userData.username }, { email: userData.email }],
      });

      if (existingUser) {
        let message =
          existingUser.username === userData.username
            ? 'Username already exists'
            : 'Email already exists';
        return res.render('sites/apology', { message });
      }

      const hashPassword = await bcrypt.hash(userData.password, HASH_SALT);

      let user = await Users.create(userData);
      await UserSecurity.create({
        _id: user._id,
        username: user.username,
        hash_password: hashPassword,
      });

      res.redirect('auth/login');
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Internal Server Error');
    }
  }

  // [POST] /auth/login/authentication
  async authentication(req, res, next) {
    try {
      let loginInformation = req.body;
      loginInformation.username = loginInformation.username.trim().toLowerCase();
      let result = await UserSecurity.find({ username: loginInformation.username });
      if (result.length === 0) {
        res.status(404).render('sites/apology', { message: `Username does not exist` });
        return;
      }
      let isMatch = await bcrypt.compare(loginInformation.password, result[0].hash_password);

      if (!isMatch) {
        res.status(401).render('sites/apology', { message: `Password is incorrect` });
      } else {
        const ObjectId = result[0]._id.toString();
        const token = jwt.sign({ _id: ObjectId, ObjectId: ObjectId }, JWT_SECRET, {
          expiresIn: '24h',
        });
        console.log('domain', domain);

        res.cookie('token', token, {
          domain: domain,
          httpOnly: true,
          // secure: true,
          secure: false,
          // sameSite: 'None',
          sameSite: 'Lax',
          maxAge: 1 * 24 * 60 * 60 * 1000,
        });
        res.redirect('/');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Internal Server Error');
    }
  }

  // [POST] /auth/api/forgot-password
  async forgotPassword(req, res) {
    try {
      let { email } = req.body;
      email = email.trim().toLowerCase();
      const user = await Users.findOne({ email: email });
      if (!user) {
        res.status(404).json({ message: 'Dont Exit this email' });
        return;
      }
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 số
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút
      await OtpReset.deleteMany({ email });

      const otpSet = await OtpReset.create({
        email: email,
        otp: otp,
        expiresAt: expiresAt,
      });
      if (!otpSet) {
        res.status(500).json({ message: 'Dont create otp reset ' });
        return;
      }
      await transporter.sendMail({
        from: `"Education App 👩‍🎓" <${GMAIL}>`,
        to: email,
        subject: '🔐 Yêu cầu đặt lại mật khẩu - OTP của bạn',
        text: `Username của bạn là: ${user.username} \nMã OTP của bạn là: ${otp} (hết hạn sau 15 phút)`, // fallback nếu không đọc được HTML
        html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <h2 style="color: #007bff;">👋 Xin chào,</h2>
                <p>Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản trên <strong>Education App</strong>.</p>
                <p style="font-size: 16px;">Username của bạn là:</p>
                <div style="font-size: 28px; font-weight: bold; background: #f8f9fa; padding: 12px 20px; border-radius: 5px; text-align: center; letter-spacing: 2px;">
                    ${user.username}
                </div>
                <p style="font-size: 16px;">Mã OTP của bạn là:</p>
                <div style="font-size: 28px; font-weight: bold; background: #f8f9fa; padding: 12px 20px; border-radius: 5px; text-align: center; letter-spacing: 2px;">
                    ${otp}
                </div>
                <p>Mã OTP này sẽ <strong>hết hạn sau 15 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
                <hr />
                <p style="font-size: 13px; color: #777;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                <p style="font-size: 13px; color: #777;">Trân trọng,<br/>Đội ngũ Education App</p>
                </div>
            `,
      });

      res.status(200).json({ message: 'OTP đã gửi tới email' });
    } catch (err) {
      console.error('Error send otp:', err);
      res.status(500).send('Internal Server Error');
    }
  }

  // [POST] /auth/api/reset-password/
  async resetPassword(req, res) {
    try {
      let { email, otp, newPassword } = req.body;
      email = email.trim().toLowerCase();
      const record = await OtpReset.findOne({ email, otp });
      if (!record || record.expiresAt < new Date()) {
        return res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn' });
      }
      const hashPassword = await bcrypt.hash(newPassword, HASH_SALT);

      const user = await Users.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: 'Dont found user form this email' });
      }
      const changePassword = await UserSecurity.findByIdAndUpdate(user._id, {
        hash_password: hashPassword,
      });
      if (!changePassword) {
        return res.status(500).json({ message: 'Failure to change password' });
      }
      await OtpReset.deleteMany({ email });

      res.status(200).json({ message: 'Update Success' });
    } catch (err) {
      console.error('Error send otp:', err);
      res.status(500).send('Internal Server Error');
    }
  }
}

module.exports = new AuthController();
