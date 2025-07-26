import React, { useState, useEffect } from 'react';
import { DarkModeToggle } from './DarkModeToggle';
import { Link } from 'react-router-dom';
const VITE_API_URL = process.env.VITE_API_URL;

export const Header = () => {
  const [role, setRole] = useState('student');
  const [fullname, setFullname] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [open, setOpen] = useState(false);

  const handleClick = (e) => {
    setOpen(false);
  };

  const getUserInfo = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/me/api/get-user-info`);
      const { userInfo } = await res.json();
      setRole(userInfo.role);
      setFullname(userInfo.fullname);
      setUserInfo(userInfo);
      return;
    } catch (error) {
      setRole('student');
      setFullname('Hồ Sơ');
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <header className="bg-header sticky top-0 z-50 flex h-14 items-center justify-between px-3">
      <div className="flex w-auto max-w-full items-center pr-4">
        <Link to="/" className="block w-auto py-2">
          <h1 className="mx-2 text-left text-xl text-white hover:text-blue-300 dark:hover:text-blue-300">
            Education
          </h1>
        </Link>
      </div>
      <div className="items-center justify-start sm:flex">
        <nav
          // :className="!navbarOpen && 'hidden' "
          id="navbarCollapse"
          className={`bg-header dark:bg-black-2 bg-gray-[--color-tertiary] absolute top-full right-0 w-auto max-w-[250px] rounded-bl-3xl px-6 py-2 shadow lg:static lg:block lg:w-full lg:max-w-full lg:shadow-none lg:dark:bg-transparent ${
            !open && 'hidden'
          } `}
        >
          <ul className="block lg:flex" onClick={handleClick}>
            {(role == 'student' || role == 'admin' || role == 'teacher') && (
              <ListItem NavLink="/home-student">Học Sinh</ListItem>
            )}
            {(role == 'student' || role == 'admin' || role == 'teacher') && (
              <>
                <ListItem NavLink="/class-teacher">Lớp Học</ListItem>
                <ListItem NavLink="/test-teacher">Đề Thi</ListItem>
                <ListItem NavLink="/essay-teacher">Đề Tự Luận</ListItem>
                <ListItem NavLink="/video-teacher">Video</ListItem>
              </>
            )}
            {(role == 'student' || role == 'admin' || role == 'teacher') && (
              <ListItem NavLink="/admin">Admin</ListItem>
            )}
          </ul>
        </nav>
      </div>
      <div className="flex items-center justify-start">
        <div className="hidden items-center justify-end sm:flex lg:pr-0">
          <Link
            to={`/me/${userInfo._id}`}
            className="bg-primary hover:bg-primary/90 rounded-md px-3 py-3 text-base font-medium text-white"
          >
            {fullname}
          </Link>
          <Link
            to="/auth/login"
            className="bg-primary hover:bg-primary/90 rounded-md px-3 py-3 text-base font-medium text-white"
          >
            Đăng Nhập
          </Link>
        </div>
        <DarkModeToggle />
      </div>
      <button
        onClick={() => setOpen(!open)}
        id="navbarToggler"
        className={` ${
          open && 'navbarTogglerActive'
        } ring-primary absolute top-1/2 right-4 block -translate-y-1/2 rounded-lg border border-cyan-600 px-3 py-[6px] focus:ring-2 lg:hidden dark:border-white`}
      >
        <span className="relative my-[6px] block h-[2px] w-[30px] bg-cyan-600 dark:bg-white"></span>
        <span className="relative my-[6px] block h-[2px] w-[30px] bg-cyan-600 dark:bg-white"></span>
        <span className="relative my-[6px] block h-[2px] w-[30px] bg-cyan-600 dark:bg-white"></span>
      </button>
    </header>
  );
};

const ListItem = ({ children, NavLink }) => {
  return (
    <>
      <li className="">
        <Link
          to={NavLink}
          className="dark:text-black-6 mx-3 flex py-2 text-base font-medium text-white hover:text-blue-300 lg:ml-3 lg:inline-flex dark:hover:text-blue-300"
        >
          {children}
        </Link>
      </li>
    </>
  );
};
