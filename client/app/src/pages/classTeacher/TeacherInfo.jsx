import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MiniLoading } from '../../components';
import { toast } from 'react-toastify';

const VITE_API_URL = process.env.VITE_API_URL;

export const TeacherInfo = () => {
  const { classId } = useParams();
  const [loading, setLoading] = useState(true);
  const [teacherInfo, setTeacherInfo] = useState(null);

  const fetchTeacherInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${VITE_API_URL}/class-teacher/api/classroom-details/get-teacher-info/${classId}`
      );
      if (res.ok) {
        const data = await res.json();
        setTeacherInfo(data);
      } else {
        toast.error('Không lấy được thông tin giáo viên');
      }
    } catch (error) {
      console.error(`Lỗi lấy dữ liệu: ${error}`);
      toast.error('Không lấy được dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <MiniLoading />
      </div>
    );
  }

  if (!teacherInfo) {
    return <p className="text-center text-red-500">Không có thông tin giáo viên</p>;
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-10">
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        {/* Tiêu đề */}
        <h1 className="text-center text-3xl font-bold text-gray-800">
          {teacherInfo.titleFullname || 'Tên giáo viên'}
        </h1>
        <p className="mt-2 text-center text-gray-500">{teacherInfo.teacherSubject}</p>

        <div className="my-6 border-t"></div>

        {/* Thông tin cá nhân */}
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>👤 Họ và tên:</strong> {teacherInfo.fullname}
            </p>
            {teacherInfo.degree && teacherInfo.degree.length > 0 ? (
              teacherInfo.degree.map((deg) => (
                <p key={deg._id}>
                  <strong>🎓 Bằng cấp:</strong> {deg.context}
                </p>
              ))
            ) : (
              <p>Không có thông tin bằng cấp</p>
            )}
            <p>
              <strong>📍 Giảng dạy:</strong> {teacherInfo.subject || 'Chưa cập nhật'}
            </p>
          </div>
          <div>
            <img
              src={teacherInfo.teacherImageLink || '/uploads/default-avatar.png'}
              alt="Ảnh giáo viên"
              className="w-full rounded-xl shadow-md"
            />
          </div>
        </div>

        {/* Các phần nội dung */}
        {teacherInfo.part &&
          teacherInfo.part.length > 0 &&
          teacherInfo.part.map((part) => (
            <div key={part._id} className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800">{part.title}</h2>
              {part.content && part.content.length > 0 && (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
                  {part.content.map((contentItem) => (
                    <li key={contentItem._id}>{contentItem.context}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
      </div>
      <Link
        to={`/class-teacher/classroom-details/${classId}/teacher-edit`}
        className="bg-primary-from hover:bg-primary-to cursor-pointer rounded-lg px-6 py-3 text-lg font-semibold text-white shadow-lg"
      >
        Chỉnh sửa thông tin
      </Link>
    </div>
  );
};
