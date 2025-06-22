const HASH_SALT = Number(process.env.HASH_SALT)
const JWT_SECRET = process.env.JWT_SECRET
const UserSecurity  = require('../models/userSecurityModel');
const jwt = require('jsonwebtoken')
const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const OtpReset = require('../models/otpResetModel.js');
const nodemailer = require('nodemailer');

const GMAIL = process.env.GMAIL;
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${GMAIL}`, 
    pass: `${GMAIL_PASSWORD}` 
  }
});

class AuthController {
    async index(req,res){
        try {
            res.render('sites/home');
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    async login(req,res,next){
        try {
            res.render('sites/login');
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    async logout(req,res,next){
        try {
            res.clearCookie('token');
            res.redirect('/auth/login');
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    async register(req,res,next){
        try {
            res.render('sites/register');
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    // [GET] /auth/forgot-password
    async forgotPasswordPage(req,res){
        try {
            res.render('sites/getOTP');
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    // [POST] /auth/register-new
    async registerNew(req,res,next){
        try {
            let registerInformation = req.body
            const { confirmPassword, ...userData } = registerInformation;
            console.log("registerInformation", registerInformation)
            let result = await Users.find({username: registerInformation.username})
            if (result.length > 0) {
                res.render('sites/apology', {message: `Username already exists`});
            } else {
                const hashPassword = await bcrypt.hash(registerInformation.password, HASH_SALT);
                let user = await Users.create(userData)
                await UserSecurity.create({
                    _id: user._id,
                    username: user.username,
                    hash_password: hashPassword
                })
                res.redirect('auth/login');
            }

        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    // [POST] /auth/login/authentication
    async authentication(req,res,next) {
        try {
            let loginInformation = req.body
            let result = await UserSecurity.find({username: loginInformation.username})
            if (result.length === 0) {
                res.status(404).render('sites/apology', {message: `Username does not exist`});
                return;
            }
            let isMatch = await bcrypt.compare(loginInformation.password, result[0].hash_password)

            if (!isMatch) {
                res.status(401).render('sites/apology', {message: `Password is incorrect`});
            } else {
                const ObjectId = result[0]._id.toString()
                const token = jwt.sign({_id: ObjectId, ObjectId: ObjectId}, JWT_SECRET, {expiresIn: '24h'});

                res.cookie('token', token, {httpOnly: true, secure: true, maxAge: 3600000});
                res.redirect('/');
            }

        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    // [POST] /auth/api/forgot-password
    async forgotPassword(req,res){
        try {
            const { email } = req.body;
            const user = await Users.find({email: email})
            if (!user){
                res.status(404).json({message: "Dont Exit this email"});
                return;
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 số
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút
            await OtpReset.deleteMany({ email }); 
            
            const otpSet = await OtpReset.create({
                email: email,
                otp: otp,
                expiresAt:expiresAt
            })
            if ( !otpSet ){
                res.status(500).json({message: "Dont create otp reset "})
                return
            }
            console.log(GMAIL, GMAIL_PASSWORD)
            await transporter.sendMail({
                from: `"Education App" <${GMAIL}>`,
                to: email,
                subject: 'OTP đặt lại mật khẩu',
                text: `Mã OTP của bạn là: ${otp} (hết hạn sau 15 phút)`         
            })
            res.status(200).json({ message: 'OTP đã gửi tới email' });
        } catch (err){
            console.error('Error send otp:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    // [POST] /auth/api/reset-password/
    async resetPassword(req,res){
        try {
            console.log("/auth/api/reset-password/ req.body",req.body)
            const { email, otp, newPassword } = req.body;
            const record = await OtpReset.findOne({ email, otp });
            if (!record || record.expiresAt < new Date()) {
                return res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn' });
            }
            const hashPassword = await bcrypt.hash(newPassword, HASH_SALT);

            const user = await Users.findOne({email: email})
            if ( !user ){
                return res.status(404).json({message: "Dont found user form this email"})
            }
            console.log("user", user)
            const changePassword = await UserSecurity.findByIdAndUpdate(user._id, {
                hash_password: hashPassword
            });
            console.log("changePassword",changePassword)
            if (!changePassword){
                return res.status(500).json({message: "Failure to change password"})
            }
            await OtpReset.deleteMany({ email });

            res.status(200).json({message: "Update Success"})
        } catch(err){
            console.error('Error send otp:', err);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = new AuthController();