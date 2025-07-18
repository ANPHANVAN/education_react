import { useEffect, useState } from 'react';
import { Table } from '@/components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

const VITE_API_URL = process.env.VITE_API_URL;

export const TestDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [testInfo, setTestInfo] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [testId, setTestId] = useState(searchParams.get('test-id'));
  const [classes, setClasses] = useState(null);
  const [putClasses, setPutClasses] = useState({
    class_id: [],
    testId: testId,
  });

  const fetchTestInfo = async () => {
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

    // try {
    //   const response = await fetch(
    //     `${VITE_API_URL}/test-teacher/api/get-test-detail?test-id=${testId}`
    //   );
    //   const test = await response.json();
    //   if (!test) {
    //     toast.error('Lỗi Lấy Thông Tin Đề Thi', {
    //       autoClose: 1000,
    //     });
    //     return;
    //   }
    //   return setTestInfo(test);
    // } catch (error) {
    //   toast.error('Không Lấy Được Thông Tin Đề Thi');
    // }
  };

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

  function openModal() {
    setModalIsOpen(true);
  }
  function closeModal() {
    setModalIsOpen(false);
  }

  const handleSubmit = async (e) => {
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

  useEffect(() => {
    fetchTestInfo();
    fetchClass();
  }, []);

  return (
    <div className="flex">
      <div className="flex-1/4 bg-white">
        <h6 className="text-truncate">
          <i className="bi bi-file-earmark-text"></i>
          {testInfo?.title}
        </h6>
        <small className="text-muted">Người tạo: {testInfo?.teacher_owner_id.fullname}</small>
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
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <button className="btn btn-outline-secondary btn-sm">Chọn tất cả lớp</button>

          <div class="input-group w-auto">
            <input
              id="searchClass"
              class="form-control form-control-sm"
              placeholder="Tìm kiếm lớp"
            />
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
          </div>
        </div>

        <div class="table-responsive rounded border">
          <table class="table-hover mb-0 table">
            <thead class="table-light">
              <tr>
                <th className="w-30"></th>
                <th>Tên lớp</th>
                <th>Khối</th>
                <th>Sĩ số</th>
              </tr>
            </thead>
            <tbody id="classListModel"></tbody>
          </table>
        </div>

        <input
          type="file"
          accept=".pdf"
          name="testFile"
          // onChange={validFileTypeAndSetFiles}
          className="file:bg-primary-from hover:file:bg-primary-to block w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        />

        <p className="text-sm text-red-600">
          Chỉ chấp nhận file <strong>.pdf</strong>
        </p>

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
      </Modal>
    </div>
  );
};
