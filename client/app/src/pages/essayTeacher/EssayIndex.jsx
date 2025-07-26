import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { Table } from '@/components';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../../components';
const VITE_API_URL = process.env.VITE_API_URL;

export const EssayIndex = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const fetchDataAndChangeTableData = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}/essay-teacher/api/get-my-essay`);
      const essays = await response.json();
      if (!response.ok) {
        return toast.error('Có Vấn Đề Khi Lấy Dữ Liệu');
      }
      const finalEssaysData = essays.map((essay) => ({
        ...essay,
        createdAt: new Date(essay.createdAt)
          .toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
          .toString(),
        classes:
          essay.class.length > 0
            ? essay.class
                .slice(0, 6) // chỉ lấy 6 lớp đầu tiên
                .map((cls) => cls.class_name)
                .join(', ') + (essay.class.length > 6 ? '...' : '')
            : 'Chưa Giao Cho Lớp Nào',
      }));
      return setTableData(finalEssaysData);
    } catch (error) {
      return toast.error('Lỗi Lấy Dữ Liệu');
    }
  };

  const tableColumn = [
    { header: 'Tiêu đề', accessor: 'title' },
    { header: 'Giao Cho Lớp', accessor: 'classes' },
    { header: 'Khối', accessor: 'grade' },
    { header: 'Ngày Tạo', accessor: 'createdAt' },
  ];

  const handleUserId = (essayId) => {
    return navigate(`/essay-teacher/essay-detail?essay-id=${essayId}`);
  };

  useEffect(() => {
    fetchDataAndChangeTableData();
  }, []);

  // Create Essay Test (modals with upload file, title, grade, subject)
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formDataCreateEssay, setFormDataCreateEssay] = useState(new FormData());
  const [formInput, setFormInput] = useState({});

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setFormDataCreateEssay(new FormData());
    setFormInput({});
    setModalIsOpen(false);
  }

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    await fetchPostNewEssay();
    closeModal();
    await fetchDataAndChangeTableData();
    setLoading(false);
  };

  const fetchPostNewEssay = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/essay-teacher/api/upload-file-essay-test`, {
        method: 'POST',
        body: formDataCreateEssay,
        credentials: 'include',
        encType: 'multipart/form-data',
      });
      if (res.ok) {
        toast.success('Tạo Đề Thi Tự Luận Thành Công!');
        // TODO: reload or fetch new display data essay
        return;
      }
      toast.error('Lỗi Khi Tạo Đề Thi!');
      return;
    } catch (error) {
      toast.error('Lỗi kết nối: ' + error.message);
    }
  };

  const validFileTypeAndSetFormData = (e) => {
    const validType = ['.pdf'];
    const name = e.target.name;
    const file = e.target.files[0];
    const extend = file?.name?.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (file && !validType.includes(extend)) {
      toast.error('Chỉ chấp nhận file .pdf');
      return (e.target.value = '');
    } else {
      return formDataCreateEssay.set(name, file);
    }
  };

  const handleChangeInputCreateEssay = (e) => {
    const { name, value } = e.target;
    formDataCreateEssay.set(name, value);
    setFormInput((prev) => ({ ...prev, [name]: value }));
    return;
  };

  return (
    <div className="bg-bg">
      <button
        className="bg-primary-from dark:border-black-2 hover:bg-body-color hover:border-body-color disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 m-3 inline-flex items-center justify-center rounded-xl border border-black px-7 py-3 text-center text-base font-medium text-white hover:cursor-pointer"
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
        Tạo Đề Thi
      </button>
      <Table data={tableData} columns={tableColumn} handleUserId={handleUserId}></Table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Tải lên đề thi"
        overlayClassName="fixed inset-0 bg-gray-600/50 dark:bg-gray-900/50 flex items-center justify-center z-20"
        className="dark:bg-bg w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <form encType="multipart/form-data" className="space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold">Tạo Đề Thi Tự Luận</h2>
          <div className="space-y-0">
            <label
              htmlFor="className"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Tiêu đề đề thi
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={formInput.title || ''}
              onChange={handleChangeInputCreateEssay}
              className="focus:border-primary-from focus:ring-primary-from/30 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring dark:text-white"
            />
          </div>
          <div className="space-y-0">
            <label
              htmlFor="className"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Tải lên file đề thi (.pdf)
            </label>
            <input
              type="file"
              accept=".pdf"
              name="upload-essay"
              required
              onChange={validFileTypeAndSetFormData}
              className="file:bg-primary-from hover:file:bg-primary-to block w-full cursor-pointer rounded-lg border border-gray-300 text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
            <p className="hidden text-sm text-red-600">
              Chỉ chấp nhận file <strong>.pdf</strong>
            </p>
          </div>

          <div className="space-y-0">
            <label
              htmlFor="grade"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Khối
            </label>
            <select
              className="focus:border-primary-from focus:ring-primary-from/30 bg-bg w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring dark:text-white"
              id="grade"
              name="grade"
              required
              value={formInput.grade || '12'}
              onChange={handleChangeInputCreateEssay}
            >
              <option value="">Chọn khối</option>
              <option value="6">Khối 6</option>
              <option value="7">Khối 7</option>
              <option value="8">Khối 8</option>
              <option value="9">Khối 9</option>
              <option value="10">Khối 10</option>
              <option value="11">Khối 11</option>
              <option value="12">Khối 12</option>
            </select>
          </div>

          <div className="space-y-0">
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Môn học
            </label>
            <select
              className="focus:border-primary-from focus:ring-primary-from/30 bg-bg w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring dark:text-white"
              id="subject"
              name="subject"
              required
              value={formInput.subject || 'Toán'}
              onChange={handleChangeInputCreateEssay}
            >
              <option value="">Chọn môn học</option>
              <option value="Toán">Toán</option>
              <option value="Vật Lý">Vật Lý</option>
              <option value="Hóa học">Hóa học</option>
              <option value="Ngữ văn">Ngữ văn</option>
              <option value="Lịch sử">Lịch sử</option>
              <option value="Địa lý">Địa lý</option>
              <option value="Tiếng Anh">Tiếng Anh</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-primary-from hover:bg-primary-to rounded-xl px-4 py-2 text-sm font-semibold text-white"
            >
              Tải lên
            </button>
          </div>
        </form>
      </Modal>
      {loading && <Loading></Loading>}
    </div>
  );
};
