const {connectRabbitMQ, getChannel} = require('../config/rabbitmq')

async function pushlishUserEvent(user, action) {
    try {
        const channel = getChannel()
        if (!channel) {
            await connectRabbitMQ()
        }
        const queue = 'user_sync_queue'
        await channel.assertQueue(queue, { durable: true })
        const message = JSON.stringify({ user, action })
        channel.sendToQueue(queue, Buffer.from(message), { persistent: true })
        console.log('User event published:', action)

    } catch (error) {
        console.error('Error publishing user event:', error)
    }
}

module.exports = {pushlishUserEvent}