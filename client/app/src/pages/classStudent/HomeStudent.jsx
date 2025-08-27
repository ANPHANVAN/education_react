import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
const VITE_API_URL = process.env.VITE_API_URL;

export const HomeStudent = () => {
  const [classData, setClassData] = useState([]);

  const fetchClass = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}/home-student/get-user-student-classes`);
      if (!response.ok) {
        toast.error('Có lỗi khi lấy dữ liệu lớp học');
        return;
      }
      const data = await response.json();
      return setClassData(data.class_id || []);
    } catch (error) {}
  };

  useEffect(() => {
    fetchClass();
    return;
  }, []);

  return (
    <div className="h-full overflow-y-auto px-5 pb-3">
      <h1 className="my-3 text-center text-xl">
        Danh sách lớp học ( <span>{classData.length}</span> lớp )
      </h1>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {classData.map((clas) => (
          <ClassItem key={clas._id} classItem={clas} />
        ))}
      </div>
    </div>
  );
};

export const ClassItem = ({ classItem }) => {
  return (
    <div className="class-item position-relative bg-bg border-surface mb-1 w-auto transform rounded-xl border p-2 shadow-xl transition-all duration-300 hover:-translate-y-0.5">
      <div className="justify-content-between align-items-center flex">
        <Link
          to={`/class-student/${classItem._id}`}
          className="text-decoration-none text-dark flex-4/5 text-2xl hover:text-blue-900 hover:underline dark:hover:text-blue-300"
        >
          <h5 className="mb-0 text-lg font-bold">{classItem.class_name}</h5>
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <small>Khối {classItem.grade}</small>
        <small className="mt-2">Sĩ số: {classItem.number_student + ' học sinh'}</small>
      </div>
      <small>Năm học: {classItem.school_year}</small>
    </div>
  );
};

export default HomeStudent;
