import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

const VITE_API_URL = process.env.VITE_API_URL;

export const VideoDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [videoId, setVideoId] = useState(searchParams.get('video-id'));
  // fetch GET Video information
  const [videoInfo, setVideoInfo] = useState({
    class: [],
  });
  // Feature give video for class, PUT classroom(open modals and set classroom)
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [listClassIdUseVideo, setListClassIdUseVideo] = useState([]);
  const [putClasses, setPutClasses] = useState({
    class_id: listClassIdUseVideo,
    videoId: videoId,
  });
  const [chooseAllClass, setChooseAllClass] = useState(false);
  // GET Class of Video
  const [videoWithClassInfo, setVideoWithClassInfo] = useState({
    class: [],
  });

  const fetchVideoInfo = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}/video-teacher/api/video-detail/${videoId}`);
      const video = await response.json();
      if (!video) {
        toast.error('Lỗi Lấy Thông Tin Video', {
          autoClose: 1000,
        });
        return;
      }
      return setVideoInfo(video);
    } catch (error) {
      toast.error('Không Lấy Được Thông Tin Video');
    }
  };

  // DELETE video
  const deleteVideo = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/video-teacher/api/delete-video/${videoId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Video đã được xóa thành công.');
        return navigate('/video-teacher');
      } else {
        toast.error('Xóa Video thất bại. Vui lòng thử lại sau.');
      }
    } catch (error) {
      toast.error('Xóa Video thất bại. Vui lòng thử lại sau.');
    }
  };

  // Feature give video for class, PUT classroom(open modals and set classroom)
  function openModal() {
    setModalIsOpen(true);
  }
  function closeModal() {
    setModalIsOpen(false);
  }
  const fetchClass = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/video-teacher/api/get-classes`);
      const data = await res.json();
      if (!res.ok) {
        return toast.error(`Lỗi Khi Lấy Thông Tin Lớp! ${data?.message}`);
      }
      return setClasses(data);
    } catch (err) {
      console.error(err);
      return toast.error(`Lỗi Khi Lấy Thông Tin Lớp!, ${err}`);
    }
  };
  const fetchPutVideoClass = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/video-teacher/api/put-class-in-video`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(putClasses),
      });
      if (!res.ok) {
        toast.error('Có lỗi khi lưu!');
        return;
      }
      toast.success('Lưu Thành Công!');
      return;
    } catch (error) {
      toast.error('Có lỗi khi lưu!');
      console.error(error);
      return;
    }
  };
  const transfromVideoInfoToListClassIdUseVideo = () => {
    console.log('videoInfo', videoInfo);
    const listClassId = videoInfo.class.map((classes) => classes._id);
    setListClassIdUseVideo(listClassId);
  };

  // GET Class of Video
  const getVideoWithClassInfo = async () => {
    try {
      const res = await fetch(
        `${VITE_API_URL}/video-teacher/api/get-class-video?video-id=${videoId}`
      );
      if (!res.ok) {
        toast.error('Lấy dữ liệu thất bại!');
        return;
      }
      const { videoInfo } = await res.json();
      setVideoWithClassInfo(videoInfo);
      return;
    } catch (err) {
      console.error(err);
      toast.error('Lấy dữ liệu thất bại!');
    }
  };

  //////////// Handle //////////////
  const handleSubmitPutClassroom = async (e) => {
    await fetchPutVideoClass();
    Promise.all([fetchVideoInfo(), getVideoWithClassInfo()]);
  };
  const handleToggleAllClasses = () => {
    const allClassIds = classes.map((cls) => cls._id);
    setChooseAllClass((prev) => {
      const newValue = !prev;
      setPutClasses((prevState) => ({
        ...prevState,
        class_id: newValue ? allClassIds : [],
      }));
      return newValue;
    });
  };
  const handleChangeCheck = (classroomId) => {
    setPutClasses((prev) => {
      const isSelected = prev.class_id.includes(classroomId);
      return {
        ...prev,
        class_id: isSelected
          ? prev.class_id.filter((id) => id !== classroomId) // bỏ nếu đang có
          : [...prev.class_id, classroomId], // thêm nếu chưa có
      };
    });
  };

  //////////////// UseEffect //////////////
  useEffect(() => {
    setPutClasses((prev) => {
      return {
        ...prev,
        class_id: listClassIdUseVideo,
      };
    });
    closeModal();
  }, [listClassIdUseVideo]);

  useEffect(() => {
    const allIds = classes
      .map((classroom) => classroom._id)
      .sort()
      .join(',');
    const selectedIds = putClasses.class_id.slice().sort().join(',');
    setChooseAllClass(allIds === selectedIds);
  }, [putClasses.class_id, classes]);

  useEffect(() => {
    transfromVideoInfoToListClassIdUseVideo();
  }, [videoInfo]);

  useEffect(() => {
    setVideoId(searchParams.get('video-id'));
  }, [searchParams]);

  useEffect(() => {
    fetchVideoInfo();
    fetchClass();
    getVideoWithClassInfo();
  }, []);

  return (
    <div className="block h-full sm:flex">
      {console.log('putClasses', putClasses)}
      <div className="bg-bg flex h-auto flex-1/4 justify-between px-4 py-4 sm:block sm:h-full lg:px-8">
        <div className="info flex-1/2">
          <h6 className="text-truncate text-xl">
            <i className="bi bi-file-earmark-text"></i>
            {videoInfo?.video_requirement_name}
          </h6>
          <small className="text-muted">Người tạo: {videoInfo?.teacher_owner_id?.fullname}</small>
          <br />
          <small className="text-muted">
            Ngày tạo:
            {new Date(videoInfo?.createdAt).toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </small>
          <br />
          {/* <small className="text-muted">Thời gian làm bài: {videoInfo?.test_time} phút</small>
            <br /> */}
          <small className="text-muted">Thời gian: {videoInfo?.video_duration}</small>
          <br />
          <small className="text-muted">
            Môn học: {videoInfo?.subject} {' - '} {videoInfo?.grade}
          </small>
          <br />
          <hr className="my-2 hidden sm:block" />
        </div>

        <div className="menuButton flex-1/2">
          {/* <h6>Menu</h6> */}
          <div className="">
            <button className="bg-primary-from hover:bg-primary-to my-1 w-full cursor-pointer rounded-xl p-2 text-white shadow-lg">
              <a href={'https://www.youtube.com/watch?v=' + videoInfo?.video_embed} target="_blank">
                <i className="fa-solid fa-file-pdf mr-1"></i> Xem Video
              </a>
            </button>
          </div>
          <div onClick={deleteVideo} className="menu-item text-dangerpy-2">
            <button className="bg-primary-from hover:bg-primary-to my-1 w-full cursor-pointer rounded-xl p-2 text-white shadow-lg">
              <i className="fa-solid fa-trash mr-1"></i> Xóa Video
            </button>
          </div>
          <hr className="my-2" />
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="bg-primary-from hover:bg-primary-to my-1 w-full cursor-pointer rounded-xl p-2 text-white shadow-lg"
              onClick={openModal}
            >
              Giao Cho Lớp
            </button>
          </div>
        </div>
      </div>

      <div className="bg-tertiary border-surface h-min-full flex-3/4 border-l-1 p-1 sm:overflow-y-auto sm:p-4">
        <h1 className="title text-text px-2 pb-2 text-2xl font-bold">
          Các lớp đang sử dụng đề tự luận
        </h1>
        <div className="listClass grid grid-cols-1 gap-4 p-2 sm:grid-cols-2 lg:grid-cols-3">
          {videoWithClassInfo.class?.length == 0 && 'Chưa Giao Cho Lớp Nào'}
          {videoWithClassInfo.class?.map((classroom) => (
            <div className="classroomItem bg-bg border-surface mb-1 transform rounded-xl border p-2 shadow-xl transition-all duration-300 hover:-translate-y-0.5">
              <Link
                to={`/video-teacher/class-video-detail?video-id=${videoId}&class_id=${classroom._id}`}
                className="block"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h5 className="text-lg font-semibold text-blue-900 dark:text-white">
                    {classroom.class_name}
                  </h5>
                  <small className="text-gray-500">Sĩ số: {classroom.number_student}</small>
                </div>
                <p className="text-sm text-gray-600">
                  Khối {classroom.grade} • Năm học {classroom.school_year}
                </p>
                <small className="text-gray-400">
                  Tạo ngày {new Date(classroom.createdAt).toLocaleDateString('vi-VN')}
                </small>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Tải lên đề thi"
        overlayClassName="fixed inset-0 bg-gray-600/50 dark:bg-gray-900/50 flex items-center justify-center z-20"
        className="dark:bg-dark max-h-10/12 w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-8 shadow-xl"
      >
        <h2 className="text-xl font-semibold text-black">Giao Đề Tự Luận Cho Lớp Học</h2>
        <div className="m-2">
          <div className="w-full">
            <input className="w-full" placeholder="Tìm kiếm lớp" />
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
          <table className="min-w-full table-auto divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="w-12 px-4 py-2 text-left text-sm font-medium text-gray-600">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-indigo-600"
                    checked={chooseAllClass}
                    onChange={handleToggleAllClasses}
                  />
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Tên lớp</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Khối</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Sĩ số</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {classes.map((classroom, index) => (
                <tr key={index} className="transition-colors duration-150 hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-600"
                      checked={putClasses.class_id.includes(classroom._id)}
                      onChange={() => handleChangeCheck(classroom._id)}
                    />
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">{classroom.class_name}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{classroom.grade}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{classroom.number_student}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <hr className="my-3" />
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={closeModal}
            className="border-surface rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bg-primary-from hover:bg-primary-to rounded-xl px-4 py-2 text-sm font-semibold text-white"
            onClick={handleSubmitPutClassroom}
          >
            Lưu
          </button>
        </div>
      </Modal>
    </div>
  );
};
