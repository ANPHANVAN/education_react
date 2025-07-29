import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MiniLoading } from '../../components';

const VITE_API_URL = process.env.VITE_API_URL;

export const Test = () => {
  const { classId } = useParams();
  const [listTest, setListTest] = useState([]);
  const [loading, setLoading] = useState(true);
  // Fetch class details from API
  const fetchGetClassDetails = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/class-teacher/api/classroom-details/${classId}/test`
      );
      if (!response.ok) {
        toast.error('Lỗi lấy dữ liệu!');
        return [];
      }
      const { testLists } = await response.json();
      setListTest(testLists);
      return testLists;
    } catch (error) {
      console.error('Error fetching class details:', error);
      toast.error(`Lỗi lấy dữ liệu! ${error}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGetClassDetails();
  }, []);

  return (
    <div className="">
      <div className="text-xl">Danh sách đề thi</div>
      {loading && <MiniLoading />}
      <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 lg:grid-cols-3">
        {!loading && listTest?.length == 0 && 'Lớp Này Chưa Được Giao Đề'}
        {listTest?.map((testItem, index) => (
          <div
            key={index}
            className="testItem bg-bg border-surface mb-1 transform rounded-xl border p-2 shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <Link
              to={`/test-teacher/test-class-detail?test-id=${testItem._id}&class_id=${classId}`}
              className="block"
            >
              <div className="mb-2 flex items-center justify-between">
                <h5 className="text-lg font-semibold text-blue-900 dark:text-white">
                  {testItem.title}
                </h5>
                <small className="text-gray-500">{testItem.test_time + "'"}</small>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <p>
                  {testItem.subject} {testItem.grade}
                </p>
                <p>Tổng Điểm: {testItem.sum_score}</p>
              </div>
              <small className="text-gray-400">
                Tạo ngày {new Date(testItem.createdAt).toLocaleDateString('vi-VN')}
              </small>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
