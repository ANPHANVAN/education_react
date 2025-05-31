function route(app){
    const authMiddleware = require('../middleware/authMiddleware')
    
    const chatRouter = require('./chat');
    const meRouter = require('./me');
    const apiRouter = require('./api');
    const indexRouter = require('./site');

    // homepage
    app.use('/chat', authMiddleware, chatRouter)
    app.use('/me', authMiddleware, meRouter)
    app.use('/api', authMiddleware, apiRouter)
    app.use('/', indexRouter)
}

module.exports = route;