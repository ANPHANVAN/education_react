require('dotenv').config();
const amqp = require('amqplib');
const { MongoClient } = require('mongodb');
const RABBIT_LINK_CONNECT = process.env.RABBIT_LINK_CONNECT;
const MONGO_LINK = process.env.MONGO_LINK;

async function startConsumer(){
    try {
        const mongoClient = new MongoClient(MONGO_LINK);
        await mongoClient.connect();
        const db = mongoClient.db('tourist_project');
        const usersCollection = db.collection('users');
        console.log('MongoDB Connected!');

        const conn = await amqp.connect(RABBIT_LINK_CONNECT)
        const channel = await conn.createChannel();
        console.log('RabbitMQ Connected!');

        const queue = 'user_sync_queue';
        await channel.assertQueue(queue, { durable: true });
        console.log('Waiting for user events...');

        channel.consume(queue, async (msg) => { 
            try {
                const { user, action } = JSON.parse(msg.content.toString());

                if (action === 'create' || action === 'update') {
                    await usersCollection.updateOne(
                        {user_id: user.user_id},
                        { $set: { username: user.username, 
                            user_id: user.user_id, 
                            email: user.email, 
                            fullname:user.fullname, 
                            deleted: false,
                            created_at: new Date(),
                            updatedAt: new Date()} 
                        },
                        { upsert: true }
                    )
                    console.log(`User ${user.user_id} synced to MongoDB`);
                }
                else if (action === 'delete') {
                    await usersCollection.deleteOne({ user_id: user.user_id });
                    console.log(`User ${user.user_id} deleted from MongoDB`);
                }
    
                channel.ack(msg);

            } catch (error) {
                console.error('Error processing message:', error);
                channel.nack(msg, false, true); // Requeue message nếu lỗi
            }
        })

    } catch (error) {
        console.error('Error RabbitMQ message:', error);
    }
}

startConsumer()