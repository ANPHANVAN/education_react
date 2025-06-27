const VideoRequirements = require('../models/videoRequirementModel.js');
const Classes = require('../models/classModel.js');
const Students = require('../models/studentModel.js');
class VideoTeacherController {
  // [GET] /video-teacher/
  async index(req, res) {
    res.render('videoTeacher/indexVideo');
  }

  // [GET] /video-teacher/create-video
  async getCreateVideo(req, res) {
    res.render('videoTeacher/createVideo');
  }

  // [GET] /video-teacher/video-detail/:videoId
  async getDetailVideo(req, res) {
    try {
      res.render('videoTeacher/videoDetail');
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while render page' });
    }
  }

  // [GET] /video-teacher/class-video-detail?video-id=videoId&class_id=classId
  async videoClassDetail(req, res) {
    try {
      res.render('videoTeacher/videoClassDetail');
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while render page' });
    }
  }

  ////////////////////////// API ROUTES /////////////////////////

  // [POST] /video-teacher/api/create-video
  async postCreateVideo(req, res) {
    const { video_requirement_name, note, video_embed, video_duration, grade, subject } = req.body;
    const videoInfomation = req.body;
    const teacher_owner_id = req.user._id;

    videoInfomation.teacher_owner_id = teacher_owner_id;

    VideoRequirements.create(videoInfomation);
    res.redirect('/video-teacher');
  }

  // [GET] /video-teacher/api/get-video  // get video of teacher
  async getVideo(req, res) {
    try {
      const teacher_owner_id = req.user._id;
      const videos = await VideoRequirements.find({ teacher_owner_id })
        .populate('teacher_owner_id', 'fullname email')
        .populate('class.class_id')
        .sort({ createdAt: -1 });

      res.status(200).json(videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // [GET] /video-teacher/api/video-detail/:videoId
  async getApiDetailVideo(req, res) {
    try {
      const videoId = req.params.videoId;
      const video = await VideoRequirements.findById(videoId)
        .populate('teacher_owner_id', 'fullname email')
        .populate('class.class_id');

      if (!video) {
        return res.status(404).json({ message: 'Video not found.' });
      }

      res.status(200).json(video);
    } catch (error) {
      console.error('Error fetching video details:', error);
      res.status(500).json({ message: 'An error occurred while fetching the video details.' });
    }
  }

  // [DELETE] /video-teacher/api/delete-video/:videoId
  async deleteApiDetailVideo(req, res) {
    try {
      const videoId = req.params.videoId;
      const teacher_owner_id = req.user._id;
      const video = await VideoRequirements.findOneAndDelete({
        _id: videoId,
        teacher_owner_id: teacher_owner_id,
      });

      if (!video) {
        return res.status(404).json({ message: 'Video not found.' });
      }

      res.status(200).json({ message: 'Video deleted successfully.' });
    } catch (error) {
      console.error('Error deleting video:', error);
      res.status(500).json({ message: 'An error occurred while deleting the video.' });
    }
  }

  // [GET] /video-teacher/api/get-classes  // this class take classes of teacher
  async getClasses(req, res) {
    try {
      const teacherId = req.user._id;
      const classes = await Classes.find({ teacher_id: teacherId });

      if (!classes || classes.length === 0) {
        return res.status(404).json({ message: 'No classes found for this teacher.' });
      }
      res.status(200).json(classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
      res.status(500).json({ message: 'An error occurred while fetching the classes.' });
    }
  }

  //[PUT] /video-teacher/api/put-class-in-video // this api to put class to video
  async putClassInVideo(req, res) {
    try {
      const { class_id, videoId } = req.body;
      if (class_id.length === 0 || !videoId) {
        return res.status(400).json({ message: 'Class ID and Video ID are required.' });
      }

      const putClass = await VideoRequirements.findOneAndUpdate(
        { _id: videoId },
        { class: class_id },
        { new: true }
      );

      if (!putClass) {
        return res.status(404).json({ message: 'Video not found.' });
      }

      res.status(200).json({ message: 'Class added to video successfully.', video: putClass });
    } catch (error) {
      console.error('Error putting class to video:', error);
      res.status(500).json({ message: 'An error occurred while putting class to video.' });
    }
  }

  // [GET] /video-teacher/api/get-class-video?vieo-id=video-id
  async getClassVideo(req, res) {
    try {
      const videoId = req.query['video-id'];
      const videoInfo = await VideoRequirements.findById(videoId).populate({
        path: 'class',
        select: '_id grade class_name number_student school_year',
      });
      if (!videoInfo) {
        res
          .status(404)
          .json({ message: 'dont found class in this video, you need add class to video' });
      }
      res.status(200).json({ videoInfo });
    } catch (err) {
      console.error('Error get data get-class-video:', error);
      res.status(500).json({ message: 'An error occurred while get class video.' });
    }
  }
  // [GET] /video-teacher/api/class-video-detail?video-id=videoId&class_id=classId
  async getVideoClassDetail(req, res) {
    try {
      const videoId = req.query['video-id'];
      const classId = req.query['class_id'];

      const videoRequirementInfo = await VideoRequirements.findById(videoId);
      const classInfo = await Classes.findById(classId, { announcement: 0 }).populate({
        path: 'students',
        populate: [
          { path: 'student_user_id', select: '_id fullname email' },
          {
            path: 'student_id',
            populate: {
              path: 'video',
            },
          },
        ],
      });
      res.status(200).json({ videoRequirementInfo, classInfo });
    } catch (err) {
      console.error('Error get data get-class-video:', err);
      res.status(500).json({ message: 'An error occurred while get class video.' });
    }
  }
}

module.exports = new VideoTeacherController();
