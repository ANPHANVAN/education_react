import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { MiniLoading } from '../../components';
const VITE_API_URL = process.env.VITE_API_URL;

export const Folder = () => {
  const tableColumn = [
    { header: 'Tên Gợi Nhớ' },
    { header: 'Tên File' },
    { header: 'Xem File' },
    { header: 'Hành Động' },
    { header: 'Ngày Tải Lên' },
  ];
  const [loading, setLoading] = useState(true);
  const { classId } = useParams();
  const [listFolder, setListFolder] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formDataCreateFile, setFormDataCreateFile] = useState(new FormData());
  const [formDataInput, setFormDataInput] = useState({ title: '' });
  // Fetch list data from API
  const fetchListData = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/folder/api/folder-teacher/${classId}/get-files`
      );
      if (!response.ok) {
        toast.error('Lỗi lấy dữ liệu!');
        return;
      }
      const data = await response.json();
      setListFolder(data);
      return;
    } catch (error) {
      console.error('Error fetching:', error);
      toast.error(`Lỗi lấy dữ liệu! ${error}`);
      return;
    } finally {
      setLoading(false);
    }
  };

  const fetchPostContent = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}/folder/api/folder-teacher/${classId}`, {
        method: 'POST',
        encType: 'multipart/form-data',
        body: formDataCreateFile,
      });
      if (!response.ok) {
        toast.error('Lỗi lấy dữ liệu!');
        return;
      }
      const data = await response.json();
      toast.success('posst thanh cong');
    } catch (error) {
      console.error('Error fetching:', error);
      toast.error(`Lỗi gửi dữ liệu! ${error}`);
      return;
    }
  };

  const fetchDeleteFile = async (fileId) => {
    try {
      const res = await fetch(`${VITE_API_URL}/folder/api/folder-teacher/${classId}/delete-file`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: fileId }),
      });
      if (!res.ok) {
        toast.error('Lỗi Xóa File');
        return;
      }
      toast.success('Xóa Thành Công');
      return;
    } catch (error) {
      console.error('Error fetching:', error);
      toast.error(`Lỗi! ${error}`);
      return;
    }
  };

  const validFileTypeAndSetFormData = (e) => {
    const validType = ['.pdf', '.png', '.jpeg', '.jpg', '.docx', '.xlsx'];
    const name = e.target.name;
    const file = e.target.files[0];
    const extend = file?.name?.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (file && !validType.includes(extend)) {
      toast.error('Chỉ chấp nhận file .pdf,.png,.jpeg,.jpg,.docx,.xlsx');
      return (e.target.value = '');
    } else {
      return formDataCreateFile.set(name, file);
    }
  };

  const handleSubmitContent = async () => {
    await fetchPostContent();
    fetchListData();
    setModalIsOpen(false);
  };

  const handleChangeInputCreateFile = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormDataInput((prev) => ({ ...prev, [name]: value }));
    formDataCreateFile.set([name], value);
  };

  const handleClickDeleteFile = async (fileId) => {
    await fetchDeleteFile(fileId);
    await fetchListData();
    setModalIsOpen(false);
  };

  useEffect(() => {
    fetchListData();
  }, []);

  useEffect(() => {
    setFormDataCreateFile(new FormData());
  }, [listFolder]);

  return (
    <div className="">
      {loading && <MiniLoading />}
      <div className="mt-2 mb-4 flex items-center justify-between">
        <div className="text-xl">Danh sách Tài Liệu</div>
        <button
          className="bg-primary-from dark:border-black-2 hover:bg-body-color hover:border-body-color disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 inline-flex items-center justify-center rounded-xl border border-black px-4 py-2 text-center text-sm font-medium text-white hover:cursor-pointer"
          onClick={() => setModalIsOpen(true)}
        >
          <span className="mr-[10px] hidden sm:block">
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
          Tải lên Tài liệu
        </button>
      </div>
      <div className="table w-full">
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
            {listFolder?.map((file, index) => {
              return (
                <tr key={index + 1}>
                  <td className="fileItem border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    {file.title}
                  </td>
                  <td className="fileItem border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    {file.file_origin_name}
                  </td>
                  <td className="fileItem border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    {new Date(file.createdAt).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="fileItem border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap">
                    <a href={file.url_file} target="_blank" className="">
                      <button className="link bg-primary-from min-w-12 cursor-pointer rounded-lg px-3 py-1 text-sm font-bold text-white">
                        Xem File
                      </button>
                    </a>
                  </td>
                  <td
                    className={`fileItem border-secondary max-h-32 truncate border-b px-4 py-2 text-sm whitespace-nowrap`}
                  >
                    <button
                      onClick={() => handleClickDeleteFile(file._id)}
                      className="bg-primary-from min-w-12 cursor-pointer rounded-lg px-3 py-1 text-sm font-bold text-white"
                    >
                      Xóa
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
        contentLabel="Chấm Điểm Học Sinh"
        overlayClassName="fixed inset-0 bg-gray-600/50 dark:bg-gray-900/50 flex items-center justify-center z-20"
        className="dark:bg-bg w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl"
      >
        <h2 className="mb-3 text-center text-2xl font-semibold">Tạo Thông Báo Cho Học Sinh</h2>
        <div className="space-y-0">
          <label
            htmlFor="className"
            className="block text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            Tiêu đề File Tài liệu
          </label>
          <input
            type="text"
            name="title"
            id="title"
            autoFocus
            required
            value={formDataInput.title}
            onChange={handleChangeInputCreateFile}
            className="focus:border-primary-from focus:ring-primary-from/30 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring dark:text-white"
          />
        </div>
        <div className="space-y-0">
          <label
            htmlFor="className"
            className="block text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            Tải lên file Tài liệu
          </label>
          <input
            type="file"
            accept=".pdf,.png,.jpeg,.jpg,.docx,.xlsx"
            name="file"
            required
            onChange={validFileTypeAndSetFormData}
            className="file:bg-primary-from hover:file:bg-primary-to block w-full cursor-pointer rounded-lg border border-gray-300 text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
          <p className="hidden text-sm text-red-600">
            Chỉ chấp nhận file <strong>.pdf</strong>
          </p>
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
            onClick={() => handleSubmitContent()}
          >
            Lưu
          </button>
        </div>
      </Modal>
    </div>
  );
};
