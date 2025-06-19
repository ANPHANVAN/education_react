const Folders = require("../models/folderModel.js");
const fs = require('fs');
const path = require('path');

class FolderController {
    async index(req,res){
        try {
            res.render('folder/indexTeacher');
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
        }
    }

    // [GET] /folder-student
    async indexStudent(req,res){
        try {

        } catch (err) {
            console.error("error engine render", err);
            res.status(500).send("Internal Server Error");
        }
    }
    /////////////////////// Teacher///////////////////
    // [GET] /folder/folder-teacher/:classId
    async indexTeacher(req,res){
        try {
            res.status(200).render("classTeacher/classroomDetailsFolders");
        } catch (err) {
            console.error("error engine render", err);
            res.status(500).send("Internal Server Error");
        }
    }

    // [POST] /folder/api/folder-teacher/:classId
    async postUploadFiles(req,res){
        try{
            const teacherId = req.user._id
            const classId = req.params.classId
            const { title } = req.body
            const { filename , originalname } = req.file
            const originalNameUtf8 = Buffer.from(originalname, 'latin1').toString('utf8');

            const folderInfo = await Folders.create({
                title:title,
                class_id : classId,
                file_origin_name: originalNameUtf8,
                url_file: `/uploads/class/${classId}/${filename}`,
                teacher_owner_id: teacherId
            });

            if(!folderInfo){
                res.status(400).json({message: "Dont create a file in this class"});
            }

            res.status(200).json({message:"success to create file", folderInfo})
        } catch(err){
            console.error("error post data folder", err);
            res.status(500).send("Internal Server Error");            
        }
    }

    // [GET] /folder/api/folder-teacher/:classId/get-files
    async getFileClass(req,res){
        try {
            const classId = req.params.classId
            const fileList = await Folders.find({class_id: classId})
            if (fileList.length == 0) {
                res.status(404).json({message: "Dont have any file in this class"})
                return;
            }

            res.status(200).json(fileList);
        } catch (err) {
            console.error("error api get-files\n", err);
            res.status(500).send("Internal Server Error");
        }        
    }
    // [DELETE] /folder/api/folder-teacher/:classId/delete-file
    async deleteFileClass(req,res){
        try {
            const classId = req.params.classId
            const teacherId = req.user._id;
            const { fileId } = req.body
            const deleteFile = await Folders.findOneAndDelete({
                _id: fileId,
                teacher_owner_id: teacherId
            })

            if (!deleteFile) {
                res.status(403).json({message: "You dont have permission to delete this file"})
            }

            const filePath = path.join(__dirname, '..', deleteFile.url_file);
            console.log("filePath", filePath)

            await fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Delete error:', err);
                    return res.status(500).json({ message: 'Xoá file thất bại.' });
                }
            });
            return res.status(200).json({ message: "Xoá file thành công." });

        } catch (err) {
            console.error("error delete file", err);
            res.status(500).send("Internal Server Error");
        }
    }

}

module.exports = new FolderController();