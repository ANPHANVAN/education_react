import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
const VITE_API_URL = process.env.VITE_API_URL;

export const EssayClassDetail = () => {
  const tableColumn = [
    { header: '#' },
    { header: 'Học Sinh' },
    { header: 'Trạng Thái' },
    { header: 'Thời Gian Nộp' },
    { header: 'Bài Nộp' },
    { header: 'Điểm' },
    { header: 'Đánh Giá' },
    { header: 'Chấm Điểm' },
  ];
  const studentFormTemplate = { submitId: '', score: 0, comments: '' };

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [classId] = useState(searchParams.get('class_id'));
  const [essayId] = useState(searchParams.get('essay-id'));
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [studentInfoModal, setStudentInfoModal] = useState({});
  const [tableData, setTableData] = useState([]);

  const [essaySubmitInfo, setEssaySubmitInfo] = useState([]);
  const [classInfo, setClassInfo] = useState({});
  const [essayInfo, setEssayInfo] = useState({});
  const [formDataEvaluate, setFormDataEvaluate] = useState(studentFormTemplate);

  const fetchGetClassEssay = async () => {
    try {
      const res = await fetch(
        `${VITE_API_URL}/essay-teacher/api/essay-class-detail?class_id=${classId}&essay-id=${essayId}`
      );
      if (!res.ok) {
        toast.error('Lỗi Khi Lấy Dữ Liệu');
        return;
      }
      const { essaySubmitInfo, classInfo, essayInfo } = await res.json();
      setEssaySubmitInfo(essaySubmitInfo);
      setClassInfo(classInfo);
      setEssayInfo(essayInfo);
      return;
    } catch (error) {
      return toast.error('Lỗi Khi Lấy Dữ Liệu');
    }
  };

  const mergedTableData = () => {
    const merged = classInfo?.students?.map((student) => {
      const substudents = essaySubmitInfo.filter(
        (essaySubmit) => essaySubmit.student_id === student.student_id
      );
      if (!substudents.length) return { ...student, submit_status: false };

      // lấy bài nộp mới nhất (time_end lớn nhất)
      substudents.sort((a, b) => new Date(b.time_end) - new Date(a.time_end));
      return {
        ...student,
        submit_status: true,
        submission: substudents[0],
      };
    });
    return setTableData(merged);
  };

  const fetchPostEvaluateStudent = async () => {
    try {
      const res = await fetch(
        `${VITE_API_URL}/essay-teacher/api/teacher-give-evaluate?essay-submit-id=${formDataEvaluate.submitId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            score: Number(formDataEvaluate.score),
            comments: formDataEvaluate.comments,
          }),
        }
      );

      if (!res.ok) {
        toast.error('Gửi đánh giá thất bại');
        return;
      }
      toast.success('Đã gửi đánh giá thành công!');
      fetchGetClassEssay();
      return;
    } catch (err) {
      console.error(err);
      toast.error('Gửi đánh giá thất bại');
      return;
    }
  };

  const clearStudentFormData = () => {
    setFormDataEvaluate(studentFormTemplate);
  };

  /////////////////// Handle ///////////////////
  const handleClickModalScoreAndComments = (student) => {
    if (!student.submit_status) {
      toast.info('Học sinh chưa làm bài nên không thể chấm điểm', { autoClose: 2000 });
      return;
    }
    setModalIsOpen(true);
    setStudentInfoModal(student);
    setFormDataEvaluate({ submitId: student.submission._id, score: null, comments: '' });
  };

  const handleChangeInputEvaluate = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormDataEvaluate((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitScoreAndComments = async (e) => {
    await fetchPostEvaluateStudent();
    clearStudentFormData();
    setModalIsOpen(false);
  };

  useEffect(() => {
    mergedTableData();
  }, [essaySubmitInfo, classInfo, essayInfo]);
  useEffect(() => {
    fetchGetClassEssay();
  }, []);

  return (
    <div className="bg-bg mx-3 my-0">
      <h1 className="title text-text px-4 py-3 text-2xl font-bold">Danh sách nộp bài</h1>
      <div id="infoCard" className="">
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-2">
          <div>
            <h5 className="mb-1 text-lg font-semibold">Thông tin đề</h5>
            <p className="text-sm text-gray-500">
              Tên Đề: <strong id="className">{essayInfo.title}</strong>
              <br />
              Môn <span id="TestSubject">{essayInfo.subject}</span>• Khối{' '}
              <span id="TestGrade">{essayInfo.grade}</span>
              <br />
              Tạo ngày:{' '}
              <span id="TestCreated">
                {new Date(essayInfo.createdAt).toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </span>
            </p>
          </div>
          <div>
            <h5 className="mb-1 text-lg font-semibold">Thông tin lớp</h5>
            <p className="text-sm text-gray-500">
              Tên lớp: <strong id="className">{classInfo.class_name}</strong>
              <br />
              Năm học: <span id="classYear">{classInfo.school_year}</span>
              <br />
              Khối: <span id="classGrade">{classInfo.grade}</span> • Sĩ số:{' '}
              <span id="classSize">{classInfo.number_student}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="bg-bg min-w-full border-collapse rounded-lg whitespace-nowrap shadow-md">
          <thead>
            <tr className="max-h-8 bg-gray-300 text-gray-700">
              {tableColumn.map((column, index) => (
                <th
                  key={index}
                  className="border-b border-gray-200 px-4 py-2 text-left font-semibold"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tableData?.map((student, index) => {
              const status = student.submit_status;
              const score = student.submission?.score ?? '';
              const comments = student.submission?.comments ?? '';
              const timeSubmit = student.submit_status
                ? new Date(student.submission.createdAt).toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : '-';
              const linkFile = student.submission?.url_file_submit ?? false;

              return (
                <tr key={index + 1}>
                  <td className="studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    <h4>{student.student_user_id.fullname}</h4>
                    <small>{student.student_user_id.email}</small>
                  </td>
                  <td
                    className={`studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap`}
                  >
                    <button
                      className={`${status ? 'bg-green-400' : 'bg-red-400'} w-24 rounded-2xl px-3 py-2 font-bold text-black`}
                    >
                      {status ? 'Đã Nộp' : 'Chưa Nộp'}
                    </button>
                  </td>
                  <td className="studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    {timeSubmit}
                  </td>
                  <td className="studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    {status ? (
                      <a href={linkFile} target="_blank" className="hover:text-blue-500">
                        Link Bài Nộp
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    {(status && student.submission.score) || '-'}
                  </td>
                  <td className="studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    {(status && student.submission.comments) || '-'}
                  </td>
                  <td className="studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    <button
                      className="bg-primary-from hover:bg-primary-to cursor-pointer rounded-2xl px-3 py-2 font-bold text-white"
                      onClick={() => {
                        handleClickModalScoreAndComments(student);
                      }}
                    >
                      Chấm Điểm
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Chấm Điểm Học Sinh"
        overlayClassName="fixed inset-0 bg-gray-600/50 dark:bg-gray-900/50 flex items-center justify-center z-20"
        className="dark:bg-bg w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl"
      >
        <h2 className="mb-3 text-center text-2xl font-semibold">
          Chấm Điểm Và Đánh Giá Bài Tự Luận
        </h2>
        <div className="studentInfo mb-1">
          <h3 className="text-xl">{studentInfoModal?.student_user_id?.fullname}</h3>
          <small className="text-muted">{studentInfoModal?.student_user_id?.email}</small>
          <br />
        </div>
        <div className="mb-1 space-y-1">
          <label
            htmlFor="className"
            className="block text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            Điểm
          </label>
          <input
            type="number"
            name="score"
            id="score"
            required
            defaultValue={studentInfoModal?.submission?.score}
            onChange={handleChangeInputEvaluate}
            className="focus:border-primary-from focus:ring-primary-from/30 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring dark:text-white"
          />
        </div>
        <div className="mb-1 space-y-1">
          <label
            htmlFor="comments"
            className="block text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            Đánh Giá
          </label>
          <textarea
            rows="4"
            cols="1"
            type="text"
            name="comments"
            id="comments"
            required
            defaultValue={studentInfoModal?.submission?.comments}
            onChange={handleChangeInputEvaluate}
            className="focus:border-primary-from focus:ring-primary-from/30 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring dark:text-white"
          />
        </div>

        <hr className="my-3" />
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setModalIsOpen(false)}
            className="border-surface rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bg-primary-from hover:bg-primary-to rounded-xl px-4 py-2 text-sm font-semibold text-white"
            onClick={() => handleSubmitScoreAndComments()}
          >
            Lưu
          </button>
        </div>
      </Modal>
    </div>
  );
};
