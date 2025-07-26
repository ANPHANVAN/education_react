//
/** Đang làm xử lý gửi điểm và đánh giá student,
 * formDataEvaluate sẽ lưu trữ thông tin score và comments,
 * formDataEvaluate thêm 1 trường submitId nữa để biết đường để gửi đi
 *
 * tiếp theo làm xử lý onChange khi nhập input thằng modals
 * sử lý ónSubmit khi gửi
 * Xử lý hiển thị
 * */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
const VITE_API_URL = process.env.VITE_API_URL;

export const EssayClassDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [classId, setClassId] = useState(searchParams.get('class_id'));
  const [essayId, setEssayId] = useState(searchParams.get('essay-id'));
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [studentInfoModal, setStudentInfoModal] = useState({});
  const [tableData, setTableData] = useState([]);

  const tableColumn = [
    { header: '#', accessor: 'title' },
    { header: 'Học Sinh', accessor: 'title' },
    { header: 'Trạng Thái', accessor: 'subject' },
    { header: 'Thời Gian Nộp', accessor: 'createdAt' },
    { header: 'Bài Nộp', accessor: 'subject' },
    { header: 'Điểm', accessor: 'createdAt' },
    { header: 'Đánh Giá', accessor: 'subject' },
    { header: 'Lưu', accessor: 'subject' },
  ];

  const [essaySubmitInfo, setEssaySubmitInfo] = useState([]);
  const [classInfo, setClassInfo] = useState({});
  const [essayInfo, setEssayInfo] = useState({});
  const [formDataEvaluate, setFormDataEvaluate] = useState({});

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
      console.log(classInfo);
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

  const handleClickModalScoreAndComments = (student) => {
    setModalIsOpen(true);
    setStudentInfoModal(student);
    // TODO: find and set submissionID
    // setFormDataEvaluate((prev)=>({...prev, submitId:student.submission.}))
  };

  const handleUserId = (essayId) => {
    return navigate(`/test-teacher/test-detail?test-id=${essayId}`);
  };

  const handleSubmitScoreAndComments = (studentInfo) => {
    fetchPostEvaluateStudent();
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
              const essaySubmitId = student.submission?.grade; // ID cần để gửi chấm điểm
              const actionSubmit = student.submission
                ? `/essay-teacher/api/teacher-give-evaluate?essay-submit-id=${
                    student.submission?._id ?? ''
                  }`
                : '';
              const timeSubmit = student.submit_status
                ? new Date(student.submission.createdAt).toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : '-';
              const linkFile = student.submit_status ? student.submission.url_file_submit : false;

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
                      className={`${status ? 'bg-green-400' : 'bg-red-400'} rounded-2xl px-3 py-2`}
                    >
                      {status ? 'Đã Nộp' : 'Chưa Nộp'}
                    </button>
                  </td>
                  <td className="studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    {timeSubmit}
                  </td>
                  <td className="studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    {status}
                  </td>
                  <td className="studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    {status ? status.score : '-'}
                  </td>
                  <td className="studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    {'comments'}
                  </td>
                  <td className="studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    <button
                      className="bg-primary-from rounded-2xl px-3 py-2"
                      onClick={() => {
                        handleClickModalScoreAndComments(student);
                      }}
                    >
                      Lưu
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
        contentLabel="Tải lên đề thi"
        overlayClassName="fixed inset-0 bg-gray-600/50 dark:bg-gray-900/50 flex items-center justify-center z-20"
        className="dark:bg-bg w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl"
      >
        <h2 className="mb-3 text-center text-xl font-semibold sm:text-2xl">
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
            // value={}
            // onChange={handleChangeInputEvaluate}
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
            // value={}
            // onChange={handleChangeInputEvaluate}
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
            onClick={() => handleSubmitScoreAndComments(studentInfoModal)}
          >
            Lưu
          </button>
        </div>
      </Modal>
    </div>
  );
};
