import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AnswerItem from './components/AnswerItem.jsx';
import { MiniLoading } from '../../components';
const VITE_API_URL = process.env.VITE_API_URL;

const SubmissionInfo = () => {
  const [loading, setLoading] = useState(true);
  const { submitId } = useParams();
  const [searchParams] = useSearchParams();
  const [classId] = useState(searchParams.get('class_id'));
  const [submissionInfo, setSubmissionInfo] = useState({});

  const fetchGetSubmissionInfo = async () => {
    try {
      const res = await fetch(
        `${VITE_API_URL}/test-student/api/submit-info/${submitId}?class_id=${classId}`
      );
      if (!res.ok) {
        toast.success('Không thể lấy dữ liệu');
        return;
      }
      const data = await res.json();
      setSubmissionInfo(data);
    } catch (err) {
      console.error(err);
      toast.error(`Không thể lấy dữ liệu! ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGetSubmissionInfo();
  }, []);
  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      {loading && <MiniLoading />}
      <h2 className="mb-3 text-center text-2xl font-bold text-blue-700 sm:text-3xl dark:text-white">
        Kết Quả Bài Làm
      </h2>
      <div className="mb-3 flex justify-center">
        <Link to={`/class-student/${classId}`}>
          <button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-all hover:bg-blue-700">
            Về Lớp
          </button>
        </Link>
      </div>

      <div className="space-y-3 rounded-lg bg-white p-4 text-gray-700 shadow-md md:p-6">
        <div className="grid gap-2 sm:grid-cols-2">
          <p>
            <strong>Họ tên:</strong>{' '}
            <span>{submissionInfo.student_id?.student_user_id.fullname}</span>
          </p>
          <p>
            <strong>Email:</strong> <span>{submissionInfo.student_id?.student_user_id.email}</span>
          </p>
          <p>
            <strong>Môn:</strong> <span>{submissionInfo.subject}</span>
          </p>
          <p>
            <strong>Lớp:</strong> <span>{submissionInfo.grade}</span>
          </p>
          <p>
            <strong>Thời gian bắt đầu:</strong>{' '}
            <span>
              {new Date(submissionInfo.time_begin).toLocaleString('vi', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </span>
          </p>
          <p>
            <strong>Thời gian kết thúc:</strong>{' '}
            <span>
              {new Date(submissionInfo.time_end).toLocaleString('vi', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </span>
          </p>
        </div>
        <p>
          <strong>Điểm số:</strong>{' '}
          <span className="inline-block rounded-md bg-green-500 px-3 font-semibold text-white">
            {submissionInfo.score}
          </span>
        </p>
      </div>

      <div className="mt-6">
        <h3 className="mb-4 text-center text-xl font-semibold">Danh sách câu đã làm</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {submissionInfo.student_answers?.map((answer) => (
            <AnswerItem key={answer._id} answer={answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubmissionInfo;
