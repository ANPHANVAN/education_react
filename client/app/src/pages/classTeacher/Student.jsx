import React, { useEffect, useState } from 'react';
import { Outlet, Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
const VITE_API_URL = process.env.VITE_API_URL;

export const Student = () => {
  // fetch GET classroom data
  const { classId } = useParams();
  const [classData, setClassData] = useState({
    class_name: 'No Data',
    school_year: 'No Data',
    students: [],
  });

  const fetchClassInfo = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/class-teacher/api/classroom-details/${classId}`
      );
      const data = await response.json();
      if (!response.ok) {
        // dont toast because in main route have toast this error
        return;
      }
      setClassData(data);
      setFilterStudent(data.students);
      return;
    } catch (error) {
      // dont toast because in main route have toast this error
      return;
    }
  };

  // Find Student
  const [filterStudent, setFilterStudent] = useState(classData.students);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);
    const filtered = classData.students.filter((student) => {
      const fullName = student.student_user_id.fullname.toLowerCase();
      const email = student.student_user_id.email.toLowerCase();
      return fullName.includes(keyword) || email.includes(keyword);
    });
    setFilterStudent(filtered);
    return;
  };

  // Add student into class
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [errorValid, setErrorValid] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChangeEmail = (e) => {
    setErrorValid(false);
    setStudentEmail(e.target.value);
    return;
  };

  const handleSubmitAddStudent = async () => {
    if (!isValidEmail(studentEmail)) {
      return setErrorValid(true);
    }
    await fetchPostAddStudent();
    setModalIsOpen(false);
    fetchClassInfo();
    return;
  };

  const fetchPostAddStudent = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/class-teacher/api/classroom-details/${classId}/add-student`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Nếu dùng JWT thì thêm Authorization header nếu cần
            // 'Authorization': 'Bearer YOUR_TOKEN'
          },
          body: JSON.stringify({ studentEmail: studentEmail }),
        }
      );

      if (!response.ok) {
        return toast.error('Lỗi Khi Thêm Học Sinh');
      }
      toast.success('Thêm Học Sinh Thành Công');
      return;
    } catch (error) {
      return toast.error('Lỗi Khi Thêm Học Sinh');
    }
  };

  // Delete Student In Class
  const fetchDeleteStudent = async (studentId) => {
    try {
      const deleteStudent = await fetch(
        `${VITE_API_URL}/class-teacher/api/classroom-details/${classId}/delete-student`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // Nếu dùng JWT thì thêm Authorization header nếu cần
            // 'Authorization': 'Bearer YOUR_TOKEN'
          },
          body: JSON.stringify({ studentId: studentId }),
        }
      );
      if (!deleteStudent.ok) {
        toast.error('Xóa Học Sinh Thất Bại');
        return;
      }
      toast.success('Xóa Học Sinh Thành Công');
      return;
    } catch (error) {
      toast.error('Xóa Học Sinh Thất Bại');
      return;
    }
  };

  const deleteStudent = async (studentId) => {
    await fetchDeleteStudent(studentId);
    fetchClassInfo();
    return;
  };

  useEffect(() => fetchClassInfo, []);

  return (
    <div className="m-2">
      <div className="m-3 flex">
        <div className="input-group me-3 w-auto flex-4/5">
          <input
            type="text"
            onChange={handleInputSearch}
            value={searchTerm}
            className="form-control p-1.5"
            placeholder="Tìm học sinh theo tên, email"
          />
        </div>
        <button
          className="flex-1/5 cursor-pointer rounded-xl border border-gray-800 px-2 text-center shadow-md dark:border-gray-300"
          onClick={() => setModalIsOpen(true)}
        >
          <i class="fa-solid fa-plus"></i> Thêm học sinh
        </button>
      </div>
      <div className="student-part w-full overflow-x-auto p-4">
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full table-auto divide-y divide-gray-200 bg-gray-400">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Sĩ số: {classData?.students?.length || 0}
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Họ và tên</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Số Báo Danh
                </th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filterStudent.map((student, index) => (
                <tr key={student.student_id._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-800">{index + 1}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {student.student_user_id.fullname}
                    <br />
                    <span className="text-xs text-gray-500">{student.student_user_id.email}</span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {String(student.student_id.registration_number).padStart(6, '0')}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-800"
                      onClick={() => deleteStudent(student.student_id._id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Tải lên đề thi"
        overlayClassName="fixed inset-0 bg-gray-600/50 dark:bg-gray-900/50 flex items-center justify-center z-20"
        className="dark:bg-bg w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <h2 className="text-xl font-semibold text-black dark:text-white">Thêm Học Sinh</h2>
        <label
          htmlFor="className"
          className="block text-sm font-medium text-gray-900 dark:text-gray-100"
        >
          Email Của Học Sinh
        </label>
        <input
          type="email"
          name="email"
          onChange={handleChangeEmail}
          className="focus:border-primary-from focus:ring-primary-from/30 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring dark:text-white"
        />
        {errorValid && <p className="mt-1 text-sm text-red-500">Vui lòng nhập email hợp lệ</p>}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setModalIsOpen(false)}
            className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmitAddStudent}
            className="bg-primary-from hover:bg-primary-to rounded-xl px-4 py-2 text-sm font-semibold text-white"
          >
            Thêm Học Sinh
          </button>
        </div>
      </Modal>
    </div>
  );
};
