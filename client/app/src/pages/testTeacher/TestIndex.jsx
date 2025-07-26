import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { Table } from '@/components';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../../components';
const VITE_API_URL = process.env.VITE_API_URL;

export const TestIndex = () => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [fileValidError, setFileValidError] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}/test-teacher/api/get-tests/`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        return toast.error('Có Vấn Đề Khi Lấy Dữ Liệu');
      }
      const finalData = data.map((test) => ({
        ...test,
        createdAt: new Date(test.createdAt)
          .toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
          .toString(),
        test_time: test.test_time + ' phút',
        classes:
          test.class.length > 0
            ? test.class
                .slice(0, 6) // chỉ lấy 6 lớp đầu tiên
                .map((cls) => cls.class_name)
                .join(', ') + (test.class.length > 6 ? ', . . .' : '')
            : 'Chưa Giao Cho Lớp Nào',
      }));
      return setTableData(finalData);
    } catch (error) {
      return toast.error('Lỗi Lấy Dữ Liệu');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const tableColumn = [
    { header: 'Tiêu đề', accessor: 'title' },
    { header: 'Thời Gian', accessor: 'test_time' },
    { header: 'Giao Cho Lớp', accessor: 'classes' },
    { header: 'Ngày Tạo', accessor: 'createdAt' },
  ];

  const handleUserId = (testId) => {
    return navigate(`/test-teacher/test-detail?test-id=${testId}`);
  };

  function openModal() {
    setModalIsOpen(true);
  }
  function closeModal() {
    setModalIsOpen(false);
  }

  const validFileTypeAndSetFiles = (e) => {
    setFileValidError(false);
    const validType = ['.pdf'];
    const file = e.target.files[0];
    const ext = file?.name?.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (file && !validType.includes(ext)) {
      toast.error('Chỉ chấp nhận file .pdf');
      setFileValidError(true);
      return (e.target.value = '');
    } else {
      return setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append('testFile', file);

    try {
      const res = await fetch(`${VITE_API_URL}/test-teacher/api/upload-files-test`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (res.ok) {
        toast.success('Tải File Lên thành công!');
        const url = new URL(res.url);
        const urlTail = url.pathname + url.search;
        navigate(urlTail, { replace: true }); // Điều hướng theo backend
      } else {
        if (res.status === 400) {
          toast.error('Không File Nào Tìm Thấy!');
        } else {
          toast.error('Lỗi hệ thống, vui lòng thử lại sau!');
        }
      }
    } catch (error) {
      toast.error('Lỗi kết nối: ' + error.message);
    } finally {
      setLoading(false);
    }
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
        className="dark:bg-dark w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <form
          encType="multipart/form-data"
          className="space-y-6"
          onSubmit={handleSubmit} // bạn có thể thêm handle submit ở đây
        >
          <h2 className="text-xl font-semibold text-black">Tải lên đề thi (PDF không có đáp án)</h2>

          <input
            type="file"
            accept=".pdf"
            name="testFile"
            onChange={validFileTypeAndSetFiles}
            className="file:bg-primary-from hover:file:bg-primary-to block w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />

          {fileValidError && (
            <p className="text-sm text-red-600">
              Chỉ chấp nhận file <strong>.pdf</strong>
            </p>
          )}
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
