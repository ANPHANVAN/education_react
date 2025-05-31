const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware')

router.use('/', authMiddleware, async function (req,res){
        try {
            res.render('sites/home');
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
        }
    })

module.exports = router;