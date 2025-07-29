import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import Modal from 'react-modal';
import Dropdown from '../../components/Dropdown';
const VITE_API_URL = process.env.VITE_API_URL;

export const ClassIndex = () => {
  const [newClassData, setNewClassData] = useState({
    className: '',
    schoolYear: '2025-2026',
    grade: 6,
  });
  const [classData, setClassData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function openModal() {
    setModalIsOpen(true);
  }
  function closeModal() {
    setModalIsOpen(false);
  }

  const fetchClass = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}/class-teacher/api/get-teacher-class`);
      if (!response.ok) {
        toast.error('Có lỗi khi lấy dữ liệu lớp học');
        return;
      }
      const data = await response.json();
      return setClassData(data[0]?.class_id || []);
    } catch (error) {}
  };

  const createClass = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}/class-teacher/api/create-class`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClassData),
      });
      const resInfo = await response.json();

      if (response.ok) {
        toast.success('Tạo lớp thành công!');
        closeModal();
        fetchClass(); // làm mới danh sách lớp
        return;
      } else {
        return toast.error(`Lỗi Khi Tạo Lớp Học! ${resInfo?.message || ''}`);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo lớp học. Vui lòng thử lại sau.');
    }
  };

  const deleteClass = async (classId) => {
    if (confirm('Bạn có chắc chắn muốn xóa lớp học này?')) {
      try {
        const response = await fetch(`${VITE_API_URL}/class-teacher/api/delete-class`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ classId: classId }),
        });
        if (!response.ok) {
          const info = await response.json();
          return toast.error(`Lỗi khi xóa khóa học! ${info?.message || ''}`);
        }
        return toast.success('Lớp học đã được xóa thành công.');
      } catch (error) {
        console.error('Error deleting class:', error);
        return toast.error('Không thể xóa lớp học. Vui lòng thử lại sau.');
      }
    }
  };

  // handle input create Class
  const handleInput = (e) => {
    const { name, value } = e.target;
    setNewClassData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // rename Class Name feature
  const [modalRenameIsOpen, setModalRenameIsOpen] = useState(false);
  const [renameData, setRenameData] = useState({
    classId: '',
    newClassName: '',
  });

  const handleRenameCallback = (classId, beforeClassName) => {
    setRenameData({ classId: classId, newClassName: beforeClassName });
    return setModalRenameIsOpen(true);
  };
  const fetchRename = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}/class-teacher/api/rename-class`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(renameData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Đổi tên lớp thành công!');
        setModalRenameIsOpen(false);
        fetchClass(); // cập nhật danh sách mới
      } else {
        toast.error(data.message || 'Không thể đổi tên lớp');
        return;
      }
    } catch (err) {
      console.error(err);
      return toast.error('Đã xảy ra lỗi khi đổi tên lớp');
    }
  };

  const handleInputRename = (e) => {
    setRenameData((prev) => ({ ...prev, newClassName: e.target.value }));
  };

  useEffect(() => {
    fetchClass();
    return;
  }, []);

  return (
    <div className="h-full overflow-y-auto px-5 pb-3">
      <button
        className="bg-primary-from dark:border-black-2 hover:bg-body-color hover:border-body-color disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 m-3 ml-0 inline-flex items-center justify-center rounded-xl border border-black px-7 py-3 text-center text-base font-medium text-white hover:cursor-pointer"
        onClick={openModal}
      >
        <span className="mr-[10px]">
          <svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current"
          >
            <g clipPath="url(#clip0_906_8052)">
              <path d="M13.1875 9.28125H10.6875V6.8125C10.6875 6.4375 10.375 6.125 9.96875 6.125C9.59375 6.125 9.28125 6.4375 9.28125 6.84375V9.3125H6.8125C6.4375 9.3125 6.125 9.625 6.125 10.0312C6.125 10.4062 6.4375 10.7187 6.84375 10.7187H9.3125V13.1875C9.3125 13.5625 9.625 13.875 10.0312 13.875C10.4062 13.875 10.7187 13.5625 10.7187 13.1562V10.6875H13.1875C13.5625 10.6875 13.875 10.375 13.875 9.96875C13.875 9.59375 13.5625 9.28125 13.1875 9.28125Z" />
              <path d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.8125 19.4688 10.0312 19.4688C15.25 19.4688 19.5 15.2188 19.5 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.5625 18.0625 10C18.0625 14.4375 14.4375 18.0625 10 18.0625Z" />
            </g>
            <defs>
              <clipPath id="clip0_906_8052">
                <rect width={20} height={20} fill="white" />
              </clipPath>
            </defs>
          </svg>
        </span>
        Tạo Lớp Học
      </button>
      {/* <h1 className="mb-3 text-center text-xl">
        Danh sách lớp học ( <span>{classData.length}</span> lớp )
      </h1> */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {classData.map((clas) => (
          <ClassItem
            key={clas._id}
            classItem={clas}
            deleteClass={deleteClass}
            handleRenameCallback={handleRenameCallback}
          />
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Tải lên đề thi"
        overlayClassName="fixed inset-0 z-20 flex items-center justify-center bg-gray-600/50 dark:bg-gray-900/50"
        className="dark:bg-bg w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <form className="space-y-6">
          <h2 className="text-xl font-semibold text-black dark:text-white">Tạo lớp học mới</h2>

          {/* Tên lớp */}
          <div className="space-y-1">
            <label
              htmlFor="className"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Tên lớp
            </label>
            <input
              type="text"
              name="className"
              id="className"
              autoFocus
              // value={newClassData.className}
              onChange={handleInput}
              className="focus:border-primary-from focus:ring-primary-from/30 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring dark:text-white"
            />
          </div>

          {/* Năm học */}
          <div className="space-y-1">
            <label
              htmlFor="schoolYear"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Năm học
            </label>
            <select
              id="schoolYear"
              name="schoolYear"
              defaultValue="2025-2026"
              // value={newClassData.schoolYear}
              onChange={handleInput}
              className="focus:border-primary-from focus:ring-primary-from/30 bg-bg w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring dark:text-white"
            >
              <option value="2023-2024">2023 - 2024</option>
              <option value="2024-2025">2024 - 2025</option>
              <option value="2025-2026">2025 - 2026</option>
              <option value="2026-2027">2026 - 2027</option>
              <option value="2027-2028">2027 - 2028</option>
              <option value="2028-2029">2028 - 2029</option>
            </select>
          </div>

          {/* Khối */}
          <div className="space-y-1">
            <label
              htmlFor="grade"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Khối
            </label>
            <select
              id="grade"
              name="grade"
              defaultValue="6"
              // value={newClassData.grade}
              onChange={handleInput}
              className="focus:border-primary-from focus:ring-primary-from/30 bg-bg w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring dark:text-white"
            >
              <option value="6">Lớp 6</option>
              <option value="7">Lớp 7</option>
              <option value="8">Lớp 8</option>
              <option value="9">Lớp 9</option>
              <option value="10">Lớp 10</option>
              <option value="11">Lớp 11</option>
              <option value="12">Lớp 12</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="text-text rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-700 hover:text-white dark:text-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={createClass}
              className="bg-primary-from hover:bg-primary-to rounded-xl px-4 py-2 text-sm font-semibold text-white"
            >
              Tải lên
            </button>
          </div>
        </form>
      </Modal>

      {/* Model Rename */}
      <Modal
        isOpen={modalRenameIsOpen}
        onRequestClose={() => setModalRenameIsOpen(false)}
        contentLabel="Đổi Tên Class"
        overlayClassName="fixed inset-0 z-20 flex items-center justify-center bg-gray-600/50 dark:bg-gray-900/50"
        className="dark:bg-bg w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <h2 className="text-xl font-semibold text-black dark:text-white">Tạo lớp học mới</h2>

        <div className="space-y-1">
          <label
            htmlFor="className"
            className="block text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            Tên lớp
          </label>
          <input
            type="text"
            name="className"
            id="className"
            autoFocus
            defaultValue={renameData.newClassName}
            onChange={handleInputRename}
            className="focus:border-primary-from focus:ring-primary-from/30 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring dark:text-white"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setModalRenameIsOpen(false)}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-700 dark:text-gray-200"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={fetchRename}
            className="bg-primary-from hover:bg-primary-to rounded-xl px-4 py-2 text-sm font-semibold text-white"
          >
            Thay Đổi Tên Lớp
          </button>
        </div>
      </Modal>
    </div>
  );
};

export const ClassItem = ({ classItem, deleteClass, handleRenameCallback }) => {
  const handleDelete = () => {
    deleteClass(classItem._id);
  };
  const handleRename = () => {
    handleRenameCallback(classItem._id, classItem.className);
  };
  return (
    <div className="class-item position-relative bg-bg border-surface mb-1 w-auto transform rounded-xl border p-2 shadow-xl transition-all duration-300 hover:-translate-y-0.5">
      <div className="justify-content-between align-items-center flex">
        <Link
          to={`/class-teacher/classroom-details/${classItem._id}`}
          className="text-decoration-none text-dark flex-4/5 text-2xl hover:text-blue-900 hover:underline dark:hover:text-blue-300"
        >
          <h5 className="mb-0 text-lg font-bold">{classItem.class_name}</h5>
        </Link>
        <div className="dropdown h-5 flex-1/5">
          <Dropdown
            classId={classItem._id}
            handleDelete={handleDelete}
            handleRename={handleRename}
          ></Dropdown>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <small>Khối {classItem.grade}</small>
        <small className="mt-2">Sĩ số: {classItem.number_student + ' học sinh'}</small>
      </div>
      <small>Năm học: {classItem.school_year}</small>
    </div>
  );
};
