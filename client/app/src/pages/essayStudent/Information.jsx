import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MiniLoading } from '../../components';

const VITE_API_URL = process.env.VITE_API_URL;

const Information = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const { essayId } = useParams();
  const [classId] = useState(searchParams.get('class_id'));
  const [essayInfo, setEssayInfo] = useState({});

  const fetchGetEssayInfo = async () => {
    try {
      const res = await fetch(
        `${VITE_API_URL}/essay-student/api/essay-information/${essayId}?class_id=${classId}`
      );
      if (!res.ok) {
        toast.error('Lỗi lấy dữ liệu');
        return;
      }
      const data = await res.json();
      setEssayInfo(data);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi lấy dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGetEssayInfo();
  }, []);

  return (
    <div className="bg-bg flex items-center justify-center p-4 sm:p-6">
      {loading ? (
        <MiniLoading />
      ) : (
        <div className="w-full max-w-lg translate-y-20 rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl sm:p-8">
          <h4 className="mb-6 text-center text-2xl font-bold text-gray-800 sm:text-3xl">
            {essayInfo?.title || 'Thông tin bài thi'}
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h5 className="text-lg font-medium text-gray-700">Thời gian làm bài:</h5>
              <span className="text-lg text-gray-600">Không giới hạn</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h5 className="text-lg font-medium text-gray-700">Môn:</h5>
              <span className="text-lg text-gray-600">
                {essayInfo?.subject && essayInfo?.grade
                  ? `${essayInfo.subject} ${essayInfo.grade}`
                  : 'Không xác định'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              {/* <h5 className="text-lg font-medium text-gray-700"></h5> */}
              <span className="text-lg text-gray-600">
                Thông tin: Bài Thi Tự Luận thí sinh chuẩn bị giấy viết, làm xong chụp hình lại tải
                lên và nộp
              </span>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              to={`/essay-student/essay/${essayId}?class_id=${classId}`}
              className="w-full sm:w-auto"
            >
              <button className="bg-primary-from hover:bg-primary-to flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 ease-in-out hover:shadow-lg sm:w-auto">
                Bắt đầu làm
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Information;
