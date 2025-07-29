import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MiniLoading } from '../../components';
const VITE_API_URL = process.env.VITE_API_URL;

export const Essay = () => {
  const { classId } = useParams();
  const [listEssay, setListEssay] = useState([]);
  const [loading, setLoading] = useState(true);
  // Fetch class details from API
  const fetchGetClassDetails = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/class-teacher/api/classroom-details/${classId}/essay`
      );
      if (!response.ok) {
        toast.error('Lỗi lấy dữ liệu!');
        return;
      }
      const { essayLists } = await response.json();
      setListEssay(essayLists);
      return;
    } catch (error) {
      console.error('Error fetching class details:', error);
      toast.error(`Lỗi lấy dữ liệu! ${error}`);
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGetClassDetails();
  }, []);

  return (
    <div className="">
      <div className="text-xl">Danh sách đề tự luận</div>
      {loading && <MiniLoading />}
      <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 lg:grid-cols-3">
        {!loading && listEssay?.length == 0 && 'Lớp Này Chưa Được Giao Đề'}
        {listEssay?.map((essayItem) => (
          <div className="essayItem bg-bg border-surface mb-1 transform rounded-xl border p-2 shadow-xl transition-all duration-300 hover:-translate-y-0.5">
            <Link
              to={`/essay-teacher/essay-class-detail?essay-id=${essayItem._id}&class_id=${classId}`}
              className="block"
            >
              <div className="mb-2 flex items-center justify-between">
                <h5 className="text-lg font-semibold text-blue-900 dark:text-white">
                  {essayItem.title}
                </h5>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <p>
                  {essayItem.subject} {essayItem.grade}
                </p>
                <small className="text-gray-400">
                  Tạo ngày {new Date(essayItem.createdAt).toLocaleDateString('vi-VN')}
                </small>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
