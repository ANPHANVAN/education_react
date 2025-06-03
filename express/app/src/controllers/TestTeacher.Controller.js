
class TestTeacherController {
    // [GET] /test-teacher/
    async index(req, res) {
        res.render('testTeacher/index');
    }

    // [GET] /test-teacher/upload-files-test
    async uploadFileTests(req, res) {
        res.render('testTeacher/uploadFiles');
    }
}

module.exports = new TestTeacherController();