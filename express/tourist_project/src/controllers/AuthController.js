const HASH_SALT = Number(process.env.HASH_SALT)
const JWT_SECRET = process.env.JWT_SECRET
const UserSecurity  = require('../models/userSecurityModel');
const jwt = require('jsonwebtoken')
const Users = require('../models/userModel');
const bcrypt = require('bcrypt');

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
}

module.exports = new AuthController();