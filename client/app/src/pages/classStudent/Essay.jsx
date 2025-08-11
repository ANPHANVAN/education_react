import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MiniLoading } from '../../components';
const VITE_API_URL = process.env.VITE_API_URL;

const Essay = () => {
  const { classId } = useParams();
  const [listEssay, setListEssay] = useState([]);
  const [studentEssaySubmit, setStudentEssaySubmit] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusInfo, setStatusInfo] = useState([]);

  // Fetch class details from API
  const fetchGetClassDetails = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/class-student/student-essay?class_id=${classId}`
      );
      if (!response.ok) {
        toast.error('Lỗi lấy dữ liệu!');
        return;
      }
      const { essayClassInfo, studentEssayInfo, student_id } = await response.json();
      setListEssay(essayClassInfo);
      setStudentEssaySubmit(studentEssayInfo);
      return;
    } catch (error) {
      console.error('Error fetching class details:', error);
      toast.error(`Lỗi lấy dữ liệu! ${error}`);
      return;
    } finally {
      setLoading(false);
    }
  };

  const caculatorStatusInfo = () => {
    const essaySubmissions = studentEssaySubmit.essay || [];
    const essayStatus = listEssay.map((essay) => {
      // Tìm bài nộp tương ứng của học sinh (nếu có)
      const submission = essaySubmissions.find((sub) => sub.essay_id === essay._id);

      return {
        essay_id: essay._id,
        title: essay.title,
        subject: essay.subject,
        grade: essay.grade,
        url_file: essay.url_file,
        score: submission?.score ?? null,
        comments: submission?.comments ?? null,
        submit_status: !!submission,
        submission_file: submission?.url_file_submit ?? null,
        submitted_at: submission?.createdAt ?? null,
      };
    });
    setStatusInfo(essayStatus);
  };

  useEffect(() => {
    const init = async () => {
      fetchGetClassDetails();
    };
    init();
  }, []);

  useEffect(() => {
    caculatorStatusInfo();
  }, [studentEssaySubmit, listEssay]);

  return (
    <div className="">
      <div className="text-xl">Danh sách đề tự luận</div>
      {loading && <MiniLoading />}
      <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 lg:grid-cols-3">
        {!loading && listEssay?.length == 0 && 'Lớp Này Chưa Được Giao Đề'}
        {statusInfo?.map((essayItem, index) => (
          <div
            key={index}
            className="essayItem bg-bg border-surface mb-1 transform rounded-xl border p-2 shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <Link
              to={`/essay-student/information/${essayItem.essay_id}?class_id=${classId}`}
              className="block"
            >
              <div className="mb-2 flex items-center justify-between">
                <h5 className="text-lg font-semibold text-blue-900 dark:text-white">
                  {essayItem.title}
                </h5>
                <p>
                  {essayItem.subject} {essayItem.grade}
                </p>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <button
                  className={`my-1 rounded-xl px-3 py-1 text-sm font-bold text-gray-100 ${essayItem.submit_status ? 'bg-green-700' : 'bg-red-700'}`}
                >
                  {essayItem.submit_status ? 'Đã Nộp' : 'Chưa Nộp'}
                </button>
                {essayItem.submit_status && (
                  <small className="text-gray-400">
                    Ngày Nộp: {new Date(essayItem.submitted_at).toLocaleDateString('vi-VN')}
                  </small>
                )}
              </div>
            </Link>
            {essayItem.submit_status && (
              <div className="submitInfo text-text flex items-center justify-between text-sm hover:underline">
                <a href={essayItem.submission_file} target="_blank">
                  Link Bài Nộp
                </a>
                {essayItem.score && <p className="font-bold">{essayItem.score + ' điểm'}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Essay;
