const RABBIT_LINK_CONNECT = process.env.RABBIT_LINK_CONNECT

const amqp = require('amqplib')

let channel = null

const connectRabbitMQ = async () => {
    try {
        const conn = await amqp.connect(RABBIT_LINK_CONNECT)
        channel = await conn.createChannel()
        console.log('RabbitMQ connected!')
        return channel
    } catch (error){
        console.log('RabbitMQ connect Failure!')
        console.error(error)
        throw error
    }
}

const getChannel = () => {
    if (!channel) {
        throw new Error('RabbitMQ channel is null')
    }
    return channel
}

module.exports = { connectRabbitMQ, getChannel}