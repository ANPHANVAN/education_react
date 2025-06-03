const REDIS_LINK = process.env.REDIS_LINK || 'redis://localhost:6379'

const { createClient } = require('redis')

const redisClient = createClient({ url: REDIS_LINK })

// Kết nối redis
async function connect() {
    try {
        await redisClient.connect()
        console.log('Redis Connected!')
    } catch (err) { 
        console.error('Connect Redis Failed', err)
    }
}

module.exports = { connect };