import React, { useEffect, useState } from 'react';
import { Outlet, Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
const VITE_API_URL = process.env.VITE_API_URL;

export const ClassDetail = () => {
  const { classId } = useParams();
  const [classData, setClassData] = useState({
    class_name: 'No Data',
    school_year: 'No Data',
  });

  const fetchClassInfo = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/class-teacher/api/classroom-details/${classId}`
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(`Lỗi Khi Lấy Dữ Liệu! ${data?.message || ''}`);
        return;
      }
      return setClassData(data);
    } catch (error) {
      toast.error(`Lỗi Khi Lấy Dữ Liệu! ${error || ''}`);
      return;
    }
  };

  useEffect(() => fetchClassInfo, []);

  return (
    <div className="flex">
      <div className="sidebar m-3 flex-1/6">
        <ul>
          <ListItem NavLink="student">Học Sinh</ListItem>
          <ListItem NavLink="test">Đề Thi</ListItem>
          <ListItem NavLink="essay">Đề Tự Luận</ListItem>
          <ListItem NavLink="video">Video</ListItem>
          <ListItem NavLink="announce">Bảng Tin</ListItem>
          <ListItem NavLink="folder">Tài Liệu</ListItem>
        </ul>
      </div>
      <div className="m-3 flex-5/6">
        <h1 className="text-3xl">{classData.class_name + ' (' + classData.school_year + ')'}</h1>
        <Outlet />
      </div>
    </div>
  );
};

const ListItem = ({ children, NavLink }) => {
  return (
    <>
      <li className="">
        <Link
          to={NavLink}
          className="text-text mx-3 flex pb-3 text-base font-medium hover:text-blue-300 lg:ml-3 lg:inline-flex dark:text-white dark:hover:text-blue-300"
        >
          {children}
        </Link>
      </li>
    </>
  );
};
