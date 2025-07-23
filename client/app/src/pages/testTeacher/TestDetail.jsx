import { useEffect, useState } from 'react';
import { Table } from '@/components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

const VITE_API_URL = process.env.VITE_API_URL;

export const TestDetail = () => {
  // General Variable
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [testId, setTestId] = useState(searchParams.get('test-id'));

  // fetch GET Test information
  const [testInfo, setTestInfo] = useState({
    class: [],
  });

  // TODO: remove data template setTestInfo
  const fetchTestInfo = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/test-teacher/api/get-test-detail?test-id=${testId}`
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
    testId: testId,
  });
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

  const handleSubmitPutClassroom = async (e) => {
    console.log('FETCH PUT METHOD');
    // try {
    //   console.log('Selected class IDs:', selectedIds);
    //   const res = await fetch(`/test-teacher/api/put-class-in-test`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ class_id: selectedIds, testId: testId }),
    //   });
    //   if (!res.ok) throw new Error('Lưu thất bại');
    //   bootstrap.Modal.getInstance(document.getElementById('assignClassModal')).hide();
    //   alert('Giao bài thành công!');
    //   window.location.reload();
    // } catch (err) {
    //   alert('Có lỗi khi lưu!');
    //   console.error(err);
    // } finally {
    //   saveBtn.disabled = false;
    // }
  };

  // GET Class of Test
  const [testWithClassInfo, setTestWithClassInfo] = useState({});

  const getTestWithClassInfo = async () => {
    try {
      const res = await fetch(
        `${VITE_API_URL}/test-teacher/api/get-test-info-details?test-id=${testId}`
      );
      if (!res.ok) {
        toast.error('Lấy dữ liệu thất bại!');
        return;
      }
      const { classTestInfo } = await res.json();
      const classes = classTestInfo?.class || [];
      setTestWithClassInfo(classes);
      return;
    } catch (err) {
      console.error(err);
      toast.error('Lấy dữ liệu thất bại!');
    }
  };

  useEffect(() => {
    fetchTestInfo();
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

      <div className="bg-tertiary flex-3/4">this is right</div>

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
                    // TODO: onChange={()=>setChooseAllClass(!chooseAllClass)}
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
