import { useEffect, useState } from 'react';
import { Outlet, Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
const VITE_API_URL = process.env.VITE_API_URL;

const ClassInfo = () => {
  const { classId } = useParams();
  const [classData, setClassData] = useState({
    class_name: 'No Data',
    school_year: 'No Data',
  });
  const [loading, setLoading] = useState(true);

  const fetchClassInfo = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}/class-student/api/${classId}`);
      const data = await response.json();
      if (!response.ok) {
        toast.error(`Lỗi Khi Lấy Dữ Liệu! ${data?.message || ''}`);
        return;
      }
      return setClassData(data);
    } catch (error) {
      toast.error(`Lỗi Khi Lấy Dữ Liệu! ${error || ''}`);
      return;
    }
  };

  useEffect(() => fetchClassInfo, []);

  return (
    <div>
      <div className="classInfo">
        <h1 className="text-3xl">{classData.class_name + ' (' + classData.school_year + ')'}</h1>
        <div className="">
          <small>Sĩ số: {classData.number_student + ' - '}</small>
          <small>Khối: {classData.grade}</small>
        </div>
      </div>
      <div className="announce">
        <h1 className="m-1 text-center text-2xl">Thông báo</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {!loading && classData?.announcement?.length == 0 && 'Chưa có thông báo nào!'}
          {classData?.announcement?.map((announceItem) => (
            <div className="announceItem bg-bg border-surface mb-1 transform rounded-xl border p-2 shadow-xl transition-all duration-300 hover:-translate-y-0.5">
              <div className="mt-1 block">
                <div className="mb-1 flex items-center justify-between">
                  <h5 className="text-sm font-semibold text-blue-900 dark:text-white">
                    {announceItem.content}
                  </h5>
                </div>
                <small className="text-gray-400">
                  Tạo ngày {new Date(announceItem.date).toLocaleDateString('vi-VN')}
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassInfo;
