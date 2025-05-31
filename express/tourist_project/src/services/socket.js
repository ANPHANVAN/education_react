module.exports = (io) => {
  const JWT_SECRET = process.env.JWT_SECRET
  let onlineUsers = [];
  const Message = require('../models/messageModel');
  const Conversation = require('../models/conversationModel');
  const UserMongo = require('../models/userModel');

  io.on('connection', async (socket) => {

    socket.on('sendUserInfo', async (data) => {
      const { userId } = data;
      try {
        socket.userId = userId;
        await UserMongo.updateOne({ _id: userId }, { $set: { online_status: true } })
        console.log('UserId connected:', socket.userId);
        let allUsers = await UserMongo.find({})
        io.emit('updateAllUsers',(allUsers));

      } catch (error) {
        console.error('JWT authentication failed:', error);
        socket.emit('error', 'Authentication failed');
        socket.disconnect();
      }
    });

    // Gửi tin nhắn
    socket.on('sendMessage', async (data) => {

      if (!socket.userId) {
        socket.emit('error', 'Not authenticated');
        return;
      }
  
      const { conversationId, message } = data;
      const newMessage = new Message({
        conversation: conversationId,
        sender: socket.userId,
        text: message.text,
      });
      await newMessage.save();
  
      // Cập nhật conversation
      await Conversation.findByIdAndUpdate(conversationId, {
        $set: { message: newMessage._id },
      });
  
      // Broadcast đến các user trong hội thoại
      const conversation = await Conversation.findById(conversationId);
      const userIdsInConversation = conversation.user.map(u => u._id);
      console.log('userIdsInConversation', userIdsInConversation);
      io.emit('receiveMessage', { conversationId, message: newMessage });
      console.log("run this line before emit")
      io.emit('updateAllConversation')
    });

    socket.on('takeMessageData', async (conversationId) => {
      try {
        const messages = await Message.find({ conversation: conversationId })
          .populate('sender', 'fullname avatar')
        io.emit('receiveMessageData', messages);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    })
  
    // Xử lý disconnect
    socket.on('disconnect', async () => {
      await UserMongo.updateOne({ _id: socket.userId }, { $set: { online_status: false } })
      let allUsers = await UserMongo.find({})
      io.emit('updateAllUsers',(allUsers));
    });
  });
}