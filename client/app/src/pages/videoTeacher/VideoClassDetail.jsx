import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
const VITE_API_URL = process.env.VITE_API_URL;

export const VideoClassDetail = () => {
  const tableColumn = [
    { header: '#' },
    { header: 'Học Sinh' },
    { header: 'Trạng Thái' },
    { header: 'Thời Gian Nộp' },
  ];
  const [searchParams] = useSearchParams();
  const [classId] = useState(searchParams.get('class_id'));
  const [videoId] = useState(searchParams.get('video-id'));
  const [tableData, setTableData] = useState([]);
  const [classInfo, setClassInfo] = useState({});
  const [videoRequirementInfo, setvideoRequirementInfo] = useState({});

  const fetchGetClassVideo = async () => {
    try {
      const res = await fetch(
        `${VITE_API_URL}/video-teacher/api/class-video-detail?video-id=${videoId}&class_id=${classId}`
      );
      if (res.ok) {
        const data = await res.json();
        setClassInfo(data.classInfo);
        setvideoRequirementInfo(data.videoRequirementInfo);
        return;
      }

      toast.error('Lỗi Khi Lấy Dữ Liệu');
      return;
    } catch (error) {
      return toast.error('Lỗi Khi Lấy Dữ Liệu');
    }
  };

  const mergedTableData = () => {
    const students = classInfo.students || [];
    const merged = students.map((student) => {
      // replace submissionInfo
      const watched = (student.student_id.video || []).filter(
        (videoItem) => videoItem.video_requirement_id === videoId && videoItem.completed
      );
      if (!watched.length) {
        return {
          fullname: student.student_user_id.fullname,
          email: student.student_user_id.email,
          status: false,
        };
      }
      // lấy lần xem mới nhất
      watched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return {
        fullname: student.student_user_id.fullname,
        email: student.student_user_id.email,
        status: true,
        watchedAt: watched[0].createdAt,
      };
    });
    return setTableData(merged);
  };

  useEffect(() => {
    mergedTableData();
  }, [classInfo, videoRequirementInfo]);

  useEffect(() => {
    fetchGetClassVideo();
  }, []);

  return (
    <div className="bg-bg mx-3 my-0">
      <h1 className="title text-text px-4 py-3 text-2xl font-bold">Danh sách nộp bài</h1>
      <div id="infoCard" className="">
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-2">
          <div>
            <h5 className="mb-1 text-lg font-semibold">
              <span>{videoRequirementInfo.video_requirement_name}</span>
            </h5>
            <p className="text-sm text-gray-500">
              Môn <span id="TestSubject">{videoRequirementInfo.subject}</span>• Khối{' '}
              <span id="TestGrade">{videoRequirementInfo.grade}</span>
              <br />
              Thời lượng:{' '}
              <strong id="TestDuration">{`${videoRequirementInfo.video_duration}`}</strong>
              <br />
              Tạo ngày:{' '}
              <span id="TestCreated">
                {new Date(videoRequirementInfo.createdAt).toLocaleString('vi-VN', {
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
              const status = student.status;
              return (
                <tr key={index + 1}>
                  <td className="studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    <h4>{student.fullname}</h4>
                    <small>{student.email}</small>
                  </td>
                  <td
                    className={`studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap`}
                  >
                    <button
                      className={`${status ? 'bg-green-400' : 'bg-red-400'} rounded-2xl px-3 py-2`}
                    >
                      {status ? 'Đã Xem' : 'Chưa Xem'}
                    </button>
                  </td>
                  <td className="studentSubmission border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    {status
                      ? new Date(student.watchedAt).toLocaleString('vi-VN', {
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
