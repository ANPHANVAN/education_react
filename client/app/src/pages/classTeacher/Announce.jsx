import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { MiniLoading } from '../../components';
const VITE_API_URL = process.env.VITE_API_URL;

export const Announce = () => {
  const { classId } = useParams();
  const [listAnnounce, setListAnnounce] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formDataContent, setFormDataContent] = useState({ content: '' });
  const [loading, setLoading] = useState(true);

  // Fetch list data from API
  const fetchListData = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/class-teacher/api/classroom-details/${classId}/announce`
      );
      if (!response.ok) {
        toast.error('Lỗi lấy dữ liệu!');
        return;
      }
      const data = await response.json();
      setListAnnounce(data.announcement);
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
      const response = await fetch(
        `${VITE_API_URL}/class-teacher/api/classroom-details/${classId}/announce`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formDataContent),
        }
      );
      if (!response.ok) {
        toast.error('Lỗi lấy dữ liệu!');
        return;
      }
      const data = await response.json();
    } catch (error) {
      console.error('Error fetching:', error);
      toast.error(`Lỗi gửi dữ liệu! ${error}`);
      return;
    }
  };

  const handleSubmitContent = async () => {
    if (formDataContent.content.length < 6) {
      return toast.info('Cần ít nhất 6 ký tự');
    }
    await fetchPostContent();
    setModalIsOpen(false);
    fetchListData();
  };

  const handleChangeInputContent = (e) => {
    setFormDataContent((prev) => ({ ...prev, content: e.target.value }));
  };

  useEffect(() => {
    fetchListData();
  }, []);

  return (
    <div className="">
      <div className="mt-2 mb-4 flex items-center justify-between">
        <div className="text-xl">Danh sách Thông báo</div>
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
          Tạo Thông Báo
        </button>
      </div>
      {loading && <MiniLoading />}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!loading && listAnnounce?.length == 0 && 'Chưa có thông báo nào!'}
        {listAnnounce?.map((announceItem) => (
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Chấm Điểm Học Sinh"
        overlayClassName="fixed inset-0 bg-gray-600/50 dark:bg-gray-900/50 flex items-center justify-center z-20"
        className="dark:bg-bg w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl"
      >
        <h2 className="mb-3 text-center text-2xl font-semibold">Tạo Thông Báo Cho Học Sinh</h2>
        <div className="mb-1 space-y-1">
          <label
            htmlFor="comments"
            className="block text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            Thông Báo
          </label>
          <textarea
            rows="4"
            cols="1"
            type="text"
            name="content"
            id="content"
            required
            value={formDataContent.content}
            onChange={handleChangeInputContent}
            className="focus:border-primary-from focus:ring-primary-from/30 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring dark:text-white"
          />
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
