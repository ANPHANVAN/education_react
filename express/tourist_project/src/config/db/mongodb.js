const MONGO_LINK=process.env.MONGO_LINK

// Using Node.js `require()`
const mongoose = require('mongoose');

async function connect(){
    try {
        await mongoose.connect(MONGO_LINK)
        .then(() => console.log('MongoDB Connected!'));

    } catch (error) {
        console.log('MongoDB connect Failure!');
    }
}

module.exports = { connect }