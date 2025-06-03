const express = require('express');
const router = express.Router();

const ChatController = require('../controllers/ChatController');

// POST /chat/api/create-conversation  This route is used to create a new conversation in database 
router.post('/api/create-conversation', ChatController.createConversation);

// GET /chat/api/get-all-conversation  This route is used to get all conversations for a user
router.get('/api/get-all-conversation', ChatController.getAllConversations);

// GET /chat/api/get-message/:conversationId  take conversation messages  
router.get('/api/get-message/:conversationId', ChatController.getMessages);

// GET /chat/api/take-user-id
router.get('/api/get-message/:conversationId', ChatController.getMessages);

// Main chat
router.use('/', ChatController.index);

module.exports = router;