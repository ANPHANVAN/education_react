import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MiniLoading } from '../../components';
const VITE_API_URL = process.env.VITE_API_URL;

export const Video = () => {
  const { classId } = useParams();
  const [listVideo, setListVideo] = useState([]);
  const [listVideoInfo, setListVideoInfo] = useState([]);
  const [studentId, setStudentId] = useState({});
  const [loading, setLoading] = useState(true);
  const [listVideoStatus, setListVideoStatus] = useState([]);

  // Fetch class details from API
  const fetchListData = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/class-student/student-video?class_id=${classId}`
      );
      if (!response.ok) {
        toast.error('Lỗi lấy dữ liệu!');
        return;
      }
      const { videoClassInfo, studentVideoInfo, student_id } = await response.json();
      setListVideo(videoClassInfo);
      setListVideoInfo(studentVideoInfo.video);
      setStudentId(student_id);
      return;
    } catch (error) {
      console.error('Error fetching:', error);
      toast.error(`Lỗi lấy dữ liệu! ${error}`);
      return;
    } finally {
      setLoading(false);
    }
  };

  const caculatorVideoStatus = () => {
    // merge information
    const videoStatus = listVideo.map((req) => {
      const completed = listVideoInfo.some((v) => v.video_requirement_id === req._id);
      return {
        video_requirement_id: req._id,
        video_requirement_name: req.video_requirement_name,
        video_embed: req.video_embed,
        video_duration: req.video_duration,
        note: req.note,
        completedStatus: completed,
        grade: req.grade,
        subject: req.subject,
        createdAt: req.createdAt,
      };
    });
    setListVideoStatus(videoStatus);
  };

  useEffect(() => {
    fetchListData();
  }, []);

  useEffect(() => {
    caculatorVideoStatus();
  }, [listVideo, listVideoInfo]);

  return (
    <div className="">
      <div className="text-xl">Danh sách Video</div>
      {loading && <MiniLoading />}
      <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 lg:grid-cols-3">
        {!loading && listVideoStatus?.length == 0 && 'Lớp Này Chưa Được Giao Đề'}
        {listVideoStatus?.map((videoItem, index) => (
          <div
            key={index}
            className="videoItem bg-bg border-surface mb-1 transform rounded-xl border p-2 shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            {/* <div class="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${videoItem.video_embed}`}
                allowfullscreen
                className="h-full w-full"
              ></iframe>
            </div> */}
            <Link
              to={`/video-student/watch-video/${videoItem.video_requirement_id}?student_id=${studentId}&class_id=${classId}`}
              className="mt-1 block"
            >
              <div className="flex items-center justify-between">
                <h5 className="text-lg font-semibold text-blue-900 dark:text-white">
                  {videoItem.video_requirement_name}
                </h5>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <button
                  className={`my-1 rounded-xl px-3 py-1 text-sm font-bold text-gray-100 ${videoItem.completedStatus ? 'bg-green-700' : 'bg-red-700'}`}
                >
                  {videoItem.completedStatus ? 'Đã Hoàn Thành' : 'Chưa Hoàn Thành'}
                </button>
                {/* <small className="text-gray-400">
                  Tạo ngày {new Date(videoItem.createdAt).toLocaleDateString('vi-VN')}
                </small> */}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <p>
                  {videoItem.subject} {videoItem.grade}
                </p>
                <small className="text-gray-400">{videoItem.video_duration}</small>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Video;
