function route(app){
    const authMiddleware = require('../middleware/authMiddleware')
    
    const chatRouter = require('./chat');
    const meRouter = require('./me');
    const homeRouter = require('./home');
    const authRouter = require('./auth');

    // [GET] /health
    app.get('/health', (req, res) => {
        res.status(200).send('OK');
    });
    app.use('/chat', authMiddleware, chatRouter)
    app.use('/me', authMiddleware, meRouter)
    app.use('/auth', authRouter)
    app.use('/', homeRouter)
}

module.exports = route;