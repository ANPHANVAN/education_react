import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { Table } from '@/components';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../../components';
import { stringify } from 'postcss';
const VITE_API_URL = process.env.VITE_API_URL;

export const VideoIndex = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const fetchDataAndChangeTableData = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}/video-teacher/api/get-video`);
      const videos = await response.json();
      if (!response.ok) {
        return toast.error('Có Vấn Đề Khi Lấy Dữ Liệu');
      }
      const finalVideosData = videos.map((video) => ({
        ...video,
        createdAt: new Date(video.createdAt)
          .toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
          .toString(),
        classes:
          video.class.length > 0
            ? video.class
                .slice(0, 6) // chỉ lấy 6 lớp đầu tiên
                .map((cls) => cls.class_name)
                .join(', ') + (video.class.length > 6 ? '...' : '')
            : 'Chưa Giao Cho Lớp Nào',
      }));
      return setTableData(finalVideosData);
    } catch (error) {
      return toast.error('Lỗi Lấy Dữ Liệu');
    }
  };

  const tableColumn = [
    { header: 'Tiêu đề', accessor: 'video_requirement_name' },
    { header: 'Giao Cho Lớp', accessor: 'classes' },
    { header: 'Khối', accessor: 'grade' },
    { header: 'Ngày Tạo', accessor: 'createdAt' },
  ];

  const handleUserId = (videoId) => {
    return navigate(`/video-teacher/video-detail?video-id=${videoId}`);
  };

  useEffect(() => {
    fetchDataAndChangeTableData();
  }, []);

  // Create Essay Test (modals with upload file, title, grade, subject)
  const formInputTemplate = {
    video_requirement_name: '',
    note: '',
    video_embed: '',
    video_duration: '',
    grade: '',
    subject: 'Toán',
  };
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formInput, setFormInput] = useState(formInputTemplate);

  const fetchPostNewVideo = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/video-teacher/api/create-video`, {
        method: 'POST',
        body: JSON.stringify(formInput),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        toast.success('Tạo Đề Thi Tự Luận Thành Công!');
        return;
      }
      toast.error('Lỗi Khi Tạo Đề Thi!');
      return;
    } catch (error) {
      toast.error('Lỗi kết nối: ' + error.message);
    }
  };

  function openModal() {
    setModalIsOpen(true);
  }

  async function closeModal() {
    setFormInput(formInputTemplate);
    setModalIsOpen(false);
  }

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    await fetchPostNewVideo();
    await fetchDataAndChangeTableData();
    closeModal();
    setLoading(false);
  };

  const handleChangeInputCreateVideo = (e) => {
    const { name, value } = e.target;
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
        Tạo Video
      </button>
      <Table data={tableData} columns={tableColumn} handleUserId={handleUserId}></Table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Tải lên đề thi"
        overlayClassName="fixed inset-0 bg-gray-600/50 dark:bg-gray-900/50 flex items-center justify-center z-20"
        className="dark:bg-bg w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold">Tạo Video Bắt buộc xem</h2>
          <div className="space-y-0">
            <label
              htmlFor="className"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Tiêu đề Video
            </label>
            <input
              type="text"
              name="video_requirement_name"
              id="video_requirement_name"
              required
              value={formInput.video_requirement_name || ''}
              onChange={handleChangeInputCreateVideo}
              className="focus:border-primary-from focus:ring-primary-from/30 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring dark:text-white"
            />
          </div>
          <div className="space-y-0">
            <label
              htmlFor="className"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Ghi Chú Cho Học Sinh
            </label>
            <input
              type="text"
              name="note"
              id="note"
              required
              value={formInput.note || ''}
              onChange={handleChangeInputCreateVideo}
              className="focus:border-primary-from focus:ring-primary-from/30 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring dark:text-white"
            />
          </div>
          <div className="space-y-0">
            <label
              htmlFor="className"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Video Id Của Youtube (VD: youtube.com/watch?v=k2WT1C2Ydo thì nhập k2WT1C2Ydo)
            </label>
            <input
              type="text"
              name="video_embed"
              id="video_embed"
              required
              value={formInput.video_embed || ''}
              onChange={handleChangeInputCreateVideo}
              className="focus:border-primary-from focus:ring-primary-from/30 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring dark:text-white"
            />
          </div>
          <div className="space-y-0">
            <label
              htmlFor="className"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Thời lượng video
            </label>
            <input
              type="text"
              name="video_duration"
              id="video_duration"
              placeholder="VD: 1 giờ 30 phút"
              required
              value={formInput.video_duration}
              onChange={handleChangeInputCreateVideo}
              className="focus:border-primary-from focus:ring-primary-from/30 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring dark:text-white"
            />
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
              value={formInput.grade}
              onChange={handleChangeInputCreateVideo}
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
              value={formInput.subject}
              onChange={handleChangeInputCreateVideo}
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
