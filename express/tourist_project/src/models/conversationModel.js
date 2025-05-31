const mongoose = require('mongoose')

const ConversationSchema = new mongoose.Schema({
    name_conversation: {
        type: String,
    },
    avatar_conversation: {
        type: String,
        default: 'https://upload.wikimedia.org/wikipedia/en/8/86/Avatar_Aang.png'
    },
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    lastMessage: {
        type: String,
    },
    message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }

},{timestamps: true})

module.exports = mongoose.model('Conversation', ConversationSchema)