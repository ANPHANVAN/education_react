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
  const [openNavBar, setOpenNavBar] = useState(false);

  const handleClick = (e) => {
    setOpenNavBar(false);
  };

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
    <div className="block h-full sm:flex">
      <div
        className="nav bg-muted sticky top-[calc(56px)] flex cursor-pointer items-center justify-center"
        onClick={() => {
          setOpenNavBar((prev) => !prev);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <button
          id="navbarToggler"
          className={`block cursor-pointer items-center px-3 py-[6px] sm:hidden`}
        >
          <span className="relative my-[6px] block h-[2px] w-[30px] bg-gray-950 text-center dark:bg-gray-950"></span>
          <span className="relative my-[6px] block h-[2px] w-[30px] bg-gray-950 text-center dark:bg-gray-950"></span>
          <span className="relative my-[6px] block h-[2px] w-[30px] bg-gray-950 text-center dark:bg-gray-950"></span>
        </button>
      </div>

      <div
        className={
          'sidebar p-3 ' +
          (openNavBar
            ? 'border-muted flex-1/6 border-b sm:border-none'
            : 'hidden border-gray-300 sm:flex sm:border-r')
        }
      >
        <ul onClick={handleClick} className="">
          <ListItem NavLink="student">Học Sinh</ListItem>
          <ListItem NavLink="test">Đề Thi</ListItem>
          <ListItem NavLink="essay">Đề Tự Luận</ListItem>
          <ListItem NavLink="video">Video</ListItem>
          <ListItem NavLink="announce">Bảng Tin</ListItem>
          <ListItem NavLink="folder">Tài Liệu</ListItem>
        </ul>
      </div>
      <div className="sm:h-full-minus-[calc(56px)] flex-5/6 overflow-auto p-4 sm:px-6">
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
          className="text-text mx-0 flex w-full justify-center pb-3 text-base font-medium hover:text-blue-300 sm:mx-3 sm:justify-start sm:text-left lg:ml-3 lg:inline-flex dark:text-white dark:hover:text-blue-300"
        >
          {children}
        </Link>
      </li>
    </>
  );
};
