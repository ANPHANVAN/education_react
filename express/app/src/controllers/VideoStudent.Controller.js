const VideoRequirements = require('../models/videoRequirementModel.js');
const Students = require('../models/studentModel.js');
const VideoProgress = require('../models/videoProgressModel.js');
class VideoStudentController {
  // [GET] /video-student/
  async index(req, res) {
    res.render('videoStudent/indexVideo');
  }

  // [GET] /video-student/watch-video/:videoRequirementId?student_id=StudentId
  async watchVideoRequirement(req, res) {
    res.render('videoStudent/watchVideoRequirement');
  }

  // [GET] /video-student/api/watch-video/:videoRequirementId
  async getVideoInfo(req, res) {
    const { videoRequirementId } = req.params;
    const videoRequirement = await VideoRequirements.findById(videoRequirementId);
    if (!videoRequirement) {
      return res.status(404).send('Video requirement not found');
    }
    res.json(videoRequirement);
  }

  // [POST] /video-student/api/finish-video/
  async createFinishVideo(req, res) {
    try {
      const { student_id, video_requirement_id } = req.body;
      const videoProgress = await VideoProgress.create({
        student_id: student_id,
        video_requirement_id: video_requirement_id,
        completed: true,
      });

      if (!videoProgress) {
        res.status(400).json({ message: 'An error occurred while create finish video' });
      }

      const studentUpdateVideo = await Students.findByIdAndUpdate(
        student_id,
        { $push: { video: videoProgress._id } },
        { new: true }
      );
      console.log('videoProgress', videoProgress);
      console.log('studentUpdateVideo', studentUpdateVideo);
      res.status(200).json({ videoProgress });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while render page', error: error });
    }
  }
}

module.exports = new VideoStudentController();
