import { useEffect, useState } from 'react';
import { Table } from '@/components';
import { useNavigate, useSearchParams } from 'react-router-dom';
const VITE_API_URL = process.env.VITE_API_URL;

export const TestClassDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [classId, setClassId] = useState(searchParams.get('class_id'));
  const [testId, setTestId] = useState(searchParams.get('test-id'));

  const [tableData, setTableData] = useState([]);

  const tableColumn = [
    { header: 'STT', accessor: 'title' },
    { header: 'Học Sinh', accessor: 'title' },
    { header: 'Trạng Thái', accessor: 'subject' },
    { header: 'Điểm', accessor: 'createdAt' },
    { header: 'Thời Gian Nộp', accessor: 'createdAt' },
  ];

  const [submissionInfo, setSubmissionInfo] = useState([]);
  const [classInfo, setClassInfo] = useState({});
  const [testInfo, setTestInfo] = useState({});

  const fetchGetClassTest = async () => {
    try {
      const res = await fetch(
        `${VITE_API_URL}/test-teacher/api/test-class-detail?class_id=${classId}&test-id=${testId}`
      );
      if (!res.ok) {
        toast.error('Lỗi Khi Lấy Dữ Liệu');
        return;
      }
      const { submissionInfo, classInfo, testInfo } = await res.json();
      setSubmissionInfo(submissionInfo);
      setClassInfo(classInfo);
      setTestInfo(testInfo);
      return;
    } catch (error) {
      return toast.error('Lỗi Khi Lấy Dữ Liệu');
    }
  };

  const mergedTableData = () => {
    const merged = classInfo?.students?.map((student) => {
      const substudents = submissionInfo.filter(
        (submission) => submission.student_id === student.student_id
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

  const handleUserId = (testId) => {
    return navigate(`/test-teacher/test-detail?test-id=${testId}`);
  };

  useEffect(() => {
    mergedTableData();
  }, [submissionInfo, classInfo, testInfo]);
  useEffect(() => {
    fetchGetClassTest();
  }, []);

  return (
    <div className="bg-bg mx-3 my-0">
      <h1 className="title text-text px-4 py-3 text-2xl font-bold">Danh sách nộp bài</h1>
      <div id="infoCard" className="">
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-2">
          <div>
            <h5 className="mb-1 text-lg font-semibold">
              <span>{testInfo.title}</span>
            </h5>
            <p className="text-sm text-gray-500">
              Môn <span id="TestSubject">{testInfo.subject}</span>• Khối{' '}
              <span id="TestGrade">{testInfo.grade}</span>
              <br />
              Thời lượng: <strong id="TestDuration">{`${testInfo.test_time} phút`}</strong>
              <br />
              Tạo ngày:{' '}
              <span id="TestCreated">
                {new Date(testInfo.createdAt).toLocaleString('vi-VN', {
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
        <table className="bg-bg min-w-full border-collapse rounded-lg shadow-md">
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
              return (
                <tr key={index + 1}>
                  <td className="studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm">
                    {index + 1}
                  </td>
                  <td className="studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm">
                    <h4>{student.student_user_id.fullname}</h4>
                    <small>{student.student_user_id.email}</small>
                  </td>
                  <td
                    className={`studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm`}
                  >
                    <button
                      className={`${status ? 'bg-green-400' : 'bg-red-400'} rounded-2xl px-3 py-2`}
                    >
                      {status ? 'Đã Nộp' : 'Chưa Nộp'}
                    </button>
                  </td>
                  <td className="studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm">
                    {status ? student.submission.score : '-'}
                  </td>
                  <td className="studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm">
                    {status
                      ? new Date(student.submission.time_end).toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
