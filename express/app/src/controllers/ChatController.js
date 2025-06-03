const FINAL_HOST = process.env.FINAL_HOST
const Conversation = require('../models/conversationModel')
const Message = require('../models/messageModel')

class ChatController {
    async index(req, res) {
        try {
            res.render('chats/chat', {FINAL_HOST:FINAL_HOST, UserId: req.user.ObjectId})
        } catch (error) {
            console.error('Error fetching chat:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // POST /chat/api/create-conversation  This route is used to create a new conversation in database 
    async createConversation(req, res) {
        try {
            let users = req.body.users
            console.log(users)
            const conversation = await Conversation.create({
                user: users,
            })
            res.json(await conversation.populate('user', 'fullname avatar'))
        } catch (error) {
            console.error('Error creating conversation:', error);
            res.status(500).json({
                message: 'Conversation create failure',
                error: error,
            });
        }
    }
    
    // GET /chat/api/get-all-conversation  This route is used to get all conversations for a user
    async getAllConversations(req,res) {
        try {
            const allConversation = await Conversation.find({ user: req.user.ObjectId })
            .populate('user', 'fullname avatar  online_status') // populate user trong conversation
            .populate({
                path: 'message',
                select: 'sender text updatedAt',
                populate: {
                    path: 'sender',
                    select: 'fullname avatar'   // populate thêm sender bên trong message
                }
            });
        
            res.json(allConversation)    
        } catch (error) {
            console.error('Error fetching conversations:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    // GET /chat/api/get-message/:conversationId  take conversation messages  
    async getMessages(req, res) {
        try {
            const conversationId = req.params.conversationId
            const messages = await Message.find({ conversation: conversationId })
                .populate('sender', 'fullname avatar')
            res.json(messages)
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
}

module.exports = new ChatController()