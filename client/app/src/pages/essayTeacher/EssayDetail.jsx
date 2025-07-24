import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

const VITE_API_URL = process.env.VITE_API_URL;

export const EssayDetail = () => {
  // General Variable
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [essayId, setEssayId] = useState(searchParams.get('test-id'));

  // fetch GET Test information
  const [testInfo, setTestInfo] = useState({
    class: [],
  });

  // TODO: remove data template setTestInfo
  const fetchEssayInfo = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/essay-teacher/api/get-essay-detail?essay-id=${essayId}`
      );
      const test = await response.json();
      if (!test) {
        toast.error('Lỗi Lấy Thông Tin Đề Thi', {
          autoClose: 1000,
        });
        return;
      }
      return setTestInfo(test);
    } catch (error) {
      toast.error('Không Lấy Được Thông Tin Đề Thi');
      setTestInfo({
        _id: '68625a50d5382449d08b55d7',
        title: 'Đăng Ký Học Phần',
        url_file: '/uploads/1752813771032-485319910-ACB%20Online%20-%20sao%20kÃª.pdf',
        grade: 12,
        test_time: 30,
        subject: 'Toán',
        teacher_owner_id: {
          _id: '68594ae3f74966354fa66035',
          fullname: 'Phan Văn An',
          email: 'anphan.mainwork@gmail.com',
        },
        class: ['6859677c9bc294de07d544b9'],
        see_answer: false,
        sum_score: 1,
        createdAt: '2025-06-30T09:35:12.232Z',
        updatedAt: '2025-06-30T09:35:21.833Z',
        __v: 0,
      });
    }
  };

  // DELETE test
  const deleteTest = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/test-teacher/api/delete-test/${testInfo._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Đề thi đã được xóa thành công.');
        return navigate('/test-teacher');
      } else {
        toast.error('Xóa đề thi thất bại. Vui lòng thử lại sau.');
      }
    } catch (error) {}
  };

  // Feature give test for class, PUT classroom(open modals and set classroom)
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [putClasses, setPutClasses] = useState({
    class_id: testInfo.class,
    testId: essayId,
  });
  const [chooseAllClass, setChooseAllClass] = useState(false);

  function openModal() {
    setModalIsOpen(true);
  }
  function closeModal() {
    setModalIsOpen(false);
    setPutClasses((prev) => {
      return {
        ...prev,
        class_id: testInfo.class,
      };
    });
  }

  const fetchClass = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/test-teacher/api/get-classes`);
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

  const fetchPutTestClass = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/test-teacher/api/put-class-in-test`, {
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
  const handleSubmitPutClassroom = async (e) => {
    await fetchPutTestClass();
    closeModal();
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

  // GET Class of Test
  const [testWithClassInfo, setTestWithClassInfo] = useState({
    class: [],
  });

  const getTestWithClassInfo = async () => {
    try {
      const res = await fetch(
        `${VITE_API_URL}/test-teacher/api/get-test-info-details?test-id=${essayId}`
      );
      if (!res.ok) {
        toast.error('Lấy dữ liệu thất bại!');
        return;
      }
      const { classTestInfo } = await res.json();
      setTestWithClassInfo(classTestInfo);
      return;
    } catch (err) {
      console.error(err);
      toast.error('Lấy dữ liệu thất bại!');
    }
  };

  useEffect(() => {
    setPutClasses((prev) => {
      return {
        ...prev,
        class_id: testInfo.class,
      };
    });
  }, [classes]);

  // get new Test when change class
  useEffect(() => {
    getTestWithClassInfo();
  }, [putClasses]);

  // toogle click all class
  useEffect(() => {
    const allIds = classes
      .map((classroom) => classroom._id)
      .sort()
      .join(',');
    const selectedIds = putClasses.class_id.slice().sort().join(',');
    setChooseAllClass(allIds === selectedIds);
  }, [putClasses.class_id, classes]);

  useEffect(() => {
    fetchEssayInfo();
    fetchClass();
    getTestWithClassInfo();
  }, []);

  return (
    <div className="flex">
      <div className="flex-1/4 bg-white">
        <h6 className="text-truncate">
          <i className="bi bi-file-earmark-text"></i>
          {testInfo?.title}
        </h6>
        <small className="text-muted">Người tạo: {testInfo?.teacher_owner_id?.fullname}</small>
        <br />
        <small className="text-muted">
          Ngày tạo:
          {new Date(testInfo?.createdAt).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </small>
        <br />
        <small className="text-muted">Thời gian làm bài: {testInfo?.test_time} phút</small>
        <br />
        <small className="text-muted">Môn học: {testInfo?.subject}</small>
        <br />
        <small className="text-muted">Khối: {testInfo?.grade}</small>
        <hr className="my-2" />

        <h6>Menu</h6>
        <div className="">
          <button className="text-tertiary bg-primary-from hover:bg-primary-to m-1 w-40 cursor-pointer rounded-xl p-2">
            <a href={testInfo?.url_file} target="_blank">
              <i className="fa-solid fa-file-pdf mr-1"></i> Xem Đề Thi
            </a>
          </button>
        </div>
        <div onClick={deleteTest} className="menu-item text-dangerpy-2">
          <button className="text-tertiary bg-primary-from hover:bg-primary-to m-1 w-40 cursor-pointer rounded-xl p-2">
            <i className="fa-solid fa-trash mr-1"></i> Xóa Đề Thi
          </button>
        </div>
        <hr className="my-2" />
        <div className="d-flex justify-content-between align-items-center">
          <button
            className="text-tertiary bg-primary-from hover:bg-primary-to m-1 w-40 cursor-pointer rounded-xl p-2"
            onClick={openModal}
          >
            Giao cho lớp
          </button>
        </div>
        <div id="list-class-for-this-test"></div>
      </div>

      <div className="bg-tertiary flex-3/4">
        <h1 className="title px-4 py-3 text-2xl font-bold text-gray-800">
          Các lớp sử dụng đề thi này
        </h1>
        <div className="listClass m-4 grid gap-4 p-4">
          {testWithClassInfo.class?.map((classroom) => (
            <div className="classroomItem mb-3 transform rounded-xl border border-b-blue-950 p-2 shadow-xl transition-all duration-300 hover:-translate-y-1">
              <Link
                to={`/test-teacher/test-class-detail?test-id=${essayId}&class_id=${classroom._id}`}
                className="block"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h5 className="text-lg font-semibold text-blue-700">{classroom.class_name}</h5>
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
        className="dark:bg-dark w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl"
      >
        <h2 className="text-xl font-semibold text-black">Tải lên đề thi (PDF không có đáp án)</h2>
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
                      onChange={() => {
                        setPutClasses((prev) => {
                          const isSelected = prev.class_id.includes(classroom._id);
                          return {
                            ...prev,
                            class_id: isSelected
                              ? prev.class_id.filter((id) => id !== classroom._id) // bỏ nếu đang có
                              : [...prev.class_id, classroom._id], // thêm nếu chưa có
                          };
                        });
                      }}
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
            className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
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
