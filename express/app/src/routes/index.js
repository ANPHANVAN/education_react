function route(app){
    const authMiddleware = require('../middleware/authMiddleware')
    const setStudentInfo = require('../middleware/setStudentInfo.js')

    const chatRouter = require('./chat');
    const meRouter = require('./me');
    const homeRouter = require('./home');
    const authRouter = require('./auth');
    const classTeacherRouter = require('./classTeacher.js');
    const classStudentRouter = require('./classStudent.js');
    const testTeacherRouter = require('./testTeacher.js');
    const videoTeacherRouter = require('./videoTeacher.js');
    const videoStudentRouter = require('./videoStudent.js');
    const testStudentRouter = require('./testStudent.js');

    // [GET] /health
    app.get('/health', (req, res) => {
        res.status(200).send('OK');
    });
    app.use('/chat', authMiddleware, chatRouter)
    app.use('/me', authMiddleware, meRouter)
    app.use('/auth', authRouter)
    app.use('/class-teacher', authMiddleware, classTeacherRouter)
    app.use('/class-student', authMiddleware, classStudentRouter)
    app.use('/test-teacher', authMiddleware, testTeacherRouter)
    app.use('/video-teacher', authMiddleware, videoTeacherRouter)
    app.use('/video-student', authMiddleware, videoStudentRouter)
    app.use('/test-student', authMiddleware, setStudentInfo, testStudentRouter)
    app.use('/', authMiddleware, homeRouter)
}

module.exports = route;