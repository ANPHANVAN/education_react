const express = require('express');
const router = express.Router();
const folderController = require('../controllers/FolderController.js');
const uploadClassFiles = require('../middleware/uploadClassFiles.js')

    // API //
    ///////////////////// Student /////////////////////
    ///////////////////// Teacher /////////////////////

    // ROUTE //
    /////////////////////// Student///////////////////
    // [GET] /folder-student
    router.get('/folder-student', folderController.indexStudent);


    /////////////////////// Teacher///////////////////
    // [GET] /folder/folder-teacher/:classId
    router.get('/folder-teacher/:classId', folderController.indexTeacher);

    // [POST] /folder/api/folder-teacher/:classId
    router.post('/api/folder-teacher/:classId', uploadClassFiles.single("file"),folderController.postUploadFiles);

    // [GET] /folder/api/folder-teacher/:classId/get-files
    router.get('/api/folder-teacher/:classId/get-files', folderController.getFileClass);

    // [DELETE] /folder/api/folder-teacher/:classId/delete-file
    router.delete('/api/folder-teacher/:classId/delete-file', folderController.deleteFileClass);
    
    // [GET] /folder
    router.get('/', folderController.index);

module.exports = router;