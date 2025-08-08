import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MiniLoading } from '../../components';

const VITE_API_URL = process.env.VITE_API_URL;

const Information = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const { testId } = useParams();
  const [classId] = useState(searchParams.get('class_id'));
  const [testInfo, setTestInfo] = useState({});

  const fetchGetTestInfo = async () => {
    try {
      const res = await fetch(
        `${VITE_API_URL}/test-student/api/test-information/${testId}?class_id=${classId}`
      );
      if (!res.ok) {
        toast.error('Lỗi lấy dữ liệu');
        return;
      }
      const data = await res.json();
      setTestInfo(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi lấy dữ liệu!');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGetTestInfo();
  }, []);

  return (
    <div className="bg-bg flex items-center justify-center p-4 sm:p-6">
      {loading ? (
        <MiniLoading />
      ) : (
        <div className="w-full max-w-lg translate-y-20 rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl sm:p-8">
          <h4 className="mb-6 text-center text-2xl font-bold text-gray-800 sm:text-3xl">
            {testInfo?.title || 'Thông tin bài thi'}
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h5 className="text-lg font-medium text-gray-700">Thời gian làm bài:</h5>
              <span className="text-lg text-gray-600">
                {testInfo?.test_time ? `${testInfo.test_time} phút` : 'Không xác định'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h5 className="text-lg font-medium text-gray-700">Thời gian vào thi:</h5>
              <span className="text-lg text-gray-600">
                {testInfo?.time_end || 'Khi nào cũng được'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h5 className="text-lg font-medium text-gray-700">Số lượng câu hỏi:</h5>
              <span className="text-lg text-gray-600">
                {testInfo?.answers?.length || 'Không xác định'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h5 className="text-lg font-medium text-gray-700">Môn:</h5>
              <span className="text-lg text-gray-600">
                {testInfo?.subject && testInfo?.grade
                  ? `${testInfo.subject} ${testInfo.grade}`
                  : 'Không xác định'}
              </span>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              to={`/test-student/test/${testId}?class_id=${classId}`}
              className="w-full sm:w-auto"
            >
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 ease-in-out hover:bg-blue-700 hover:shadow-lg sm:w-auto">
                Bắt đầu thi
                <i className="bi bi-chevron-right"></i>
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Information;
