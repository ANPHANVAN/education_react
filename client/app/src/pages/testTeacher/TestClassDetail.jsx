import { useEffect, useState } from 'react';
import { Table } from '@/components';
import { useNavigate } from 'react-router-dom';

export const TestClassDetail = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([
    {
      _id: '68625a50d5382449d08b55d7',
      title: 'Đăng Ký Học Phần',
      url_file:
        '/uploads/1751276008459-686413759-%C3%84%C2%90%C3%84%C2%83ng%20k%C3%83%C2%BD%20h%C3%A1%C2%BB%C2%8Dc%20ph%C3%A1%C2%BA%C2%A7n.pdf',
      grade: 12,
      test_time: 30,
      subject: 'Toán',
      teacher_owner_id: '68594ae3f74966354fa66035',
      class: [
        {
          _id: '6859677c9bc294de07d544b9',
          class_name: 'lớp học tình thương',
        },
      ],
      see_answer: false,
      sum_score: 1,
      createdAt: '2025-06-30T09:35:12.232Z',
      updatedAt: '2025-06-30T09:35:21.833Z',
      __v: 0,
    },
    {
      _id: '68625a50d5382449d08b554534',
      title: 'Đăng Ký Học Phần',
      url_file:
        '/uploads/1751276008459-686413759-%C3%84%C2%90%C3%84%C2%83ng%20k%C3%83%C2%BD%20h%C3%A1%C2%BB%C2%8Dc%20ph%C3%A1%C2%BA%C2%A7n.pdf',
      grade: 12,
      test_time: 30,
      subject: 'Toán',
      teacher_owner_id: '68594ae3f74966354fa66035',
      class: [
        {
          _id: '6859677c9bc294de07d544b9',
          class_name: 'lớp học tình thương',
        },
      ],
      see_answer: false,
      sum_score: 1,
      createdAt: '2025-06-30T09:35:12.232Z',
      updatedAt: '2025-06-30T09:35:21.833Z',
      __v: 0,
    },
    {
      _id: '68625a50d538249d08b554534',
      title: 'Đăng Ký Học Phần',
      url_file:
        '/uploads/1751276008459-686413759-%C3%84%C2%90%C3%84%C2%83ng%20k%C3%83%C2%BD%20h%C3%A1%C2%BB%C2%8Dc%20ph%C3%A1%C2%BA%C2%A7n.pdf',
      grade: 12,
      test_time: 30,
      subject: 'Toán',
      teacher_owner_id: '68594ae3f74966354fa66035',
      class: [
        {
          _id: '6859677c9bc294de07d544b9',
          class_name: 'lớp học tình thương',
        },
      ],
      see_answer: false,
      sum_score: 1,
      createdAt: '2025-06-30T09:35:12.232Z',
      updatedAt: '2025-06-30T09:35:21.833Z',
      __v: 0,
    },
  ]);

  const tableColumn = [
    { header: 'Tiêu đề', accessor: 'title' },
    { header: 'Môn học', accessor: 'subject' },
    { header: 'Giao Cho Lớp', accessor: 'createdAt' },
    { header: 'Ngày Tạo', accessor: 'createdAt' },
  ];

  const handleUserId = (testId) => {
    return navigate(`/test-teacher/test-detail?test-id=${testId}`);
  };

  return (
    <div className="bg-bg">
      <button className="bg-primary-from dark:border-black-2 hover:bg-body-color hover:border-body-color disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 m-3 inline-flex items-center justify-center rounded-xl border border-black px-7 py-3 text-center text-base font-medium text-white hover:cursor-pointer">
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
    </div>
  );
};
