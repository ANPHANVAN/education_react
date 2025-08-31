import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MiniLoading } from '../../components';

const VITE_API_URL = process.env.VITE_API_URL;

const Test = () => {
  const { classId } = useParams();
  const [listTest, setListTest] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch class details from API
  const fetchGetClassDetails = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/class-student/api/get-class-test?class_id=${classId}`
      );
      if (!response.ok) {
        toast.error('Lỗi lấy dữ liệu!');
        return;
      }
      const { tests, student_id } = await response.json();
      setListTest(tests);
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
              to={`/test-student/information/${testItem.test_id}?class_id=${classId}`}
              className="block"
            >
              <div className="flex items-center justify-between">
                <h5 className="text-lg font-semibold text-blue-900 dark:text-white">
                  {testItem.test_title}
                </h5>
              </div>
              <div className="status flex items-center justify-between">
                {testItem.test_status_submit ? (
                  <button className="my-1 rounded-xl bg-green-700 px-3 py-1 text-sm font-bold text-gray-100">
                    Đã Nộp
                  </button>
                ) : (
                  <button className="my-1 rounded-xl bg-red-700 px-3 py-1 text-sm font-bold text-gray-100">
                    Chưa Nộp
                  </button>
                )}
                {testItem.test_status_submit && (
                  <small className="text-gray-400">
                    Thời gian nộp: {new Date(testItem.time_end).toLocaleDateString('vi-VN')}
                  </small>
                )}
              </div>
              {testItem.test_status_submit && (
                <div className="testSubmitInfo">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <p className="text-text font-bold">
                      Điểm {testItem.score}/{testItem.sum_score}
                    </p>
                    <p>Thời gian làm bài: {testItem.time_test + "'"}</p>
                  </div>
                </div>
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Test;
