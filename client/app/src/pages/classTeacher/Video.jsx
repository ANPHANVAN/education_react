import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MiniLoading } from '../../components';
const VITE_API_URL = process.env.VITE_API_URL;

export const Video = () => {
  const { classId } = useParams();
  const [listVideo, setListVideo] = useState([]);
  const [loading, setLoading] = useState(true);
  // Fetch class details from API
  const fetchListData = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/class-teacher/api/classroom-details/${classId}/video`
      );
      if (!response.ok) {
        toast.error('Lỗi lấy dữ liệu!');
        return;
      }
      const { videoClassList } = await response.json();
      setListVideo(videoClassList);
      return;
    } catch (error) {
      console.error('Error fetching:', error);
      toast.error(`Lỗi lấy dữ liệu! ${error}`);
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListData();
  }, []);

  return (
    <div className="">
      <div className="text-xl">Danh sách Video</div>
      {loading && <MiniLoading />}
      <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 lg:grid-cols-3">
        {!loading && listVideo?.length == 0 && 'Lớp Này Chưa Được Giao Đề'}
        {listVideo?.map((videoItem) => (
          <div className="videoItem bg-bg border-surface mb-1 transform rounded-xl border p-2 shadow-xl transition-all duration-300 hover:-translate-y-0.5">
            <div class="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${videoItem.video_embed}`}
                allowfullscreen
                className="h-full w-full"
              ></iframe>
            </div>
            <Link
              to={`/video-teacher/class-video-detail?video-id=${videoItem._id}&class_id=${classId}`}
              className="mt-1 block"
            >
              <div className="mb-1 flex items-center justify-between">
                <h5 className="text-lg font-semibold text-blue-900 dark:text-white">
                  {videoItem.video_requirement_name}
                </h5>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <p>
                  {videoItem.subject} {videoItem.grade}
                </p>
                <small className="text-gray-400">{videoItem.video_duration}</small>
              </div>
              <small className="text-gray-400">
                Tạo ngày {new Date(videoItem.createdAt).toLocaleDateString('vi-VN')}
              </small>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
