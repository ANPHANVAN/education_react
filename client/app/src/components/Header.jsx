import React, { useState } from 'react';
import { DarkModeToggle } from './DarkModeToggle';
import { Link } from 'react-router-dom';
export const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className={`bg-gray-header sticky top-0 z-50 flex w-full items-center`}>
      <div className="container">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="w-60 max-w-full px-4">
            <a href="/#" className="block w-full py-5">
              <h1 className="mx-5 text-xl text-white hover:text-blue-300 dark:hover:text-blue-300">
                Education
              </h1>
            </a>
          </div>
          <div className="flex w-full items-center justify-between px-4">
            <div>
              <button
                onClick={() => setOpen(!open)}
                id="navbarToggler"
                className={` ${
                  open && 'navbarTogglerActive'
                } ring-primary absolute top-1/2 right-4 block -translate-y-1/2 rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden`}
              >
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-cyan-900 dark:bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-cyan-900 dark:bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-cyan-900 dark:bg-white"></span>
              </button>
              <nav
                // :className="!navbarOpen && 'hidden' "
                id="navbarCollapse"
                className={`dark:bg-black-2 bg-gray-[--color-tertiary] absolute top-full right-4 w-full max-w-[250px] rounded-lg px-6 py-3 shadow lg:static lg:block lg:w-full lg:max-w-full lg:shadow-none lg:dark:bg-transparent ${
                  !open && 'hidden'
                } `}
              >
                <ul className="block lg:flex">
                  <ListItem NavLink="/home-student">Học Sinh</ListItem>
                  <ListItem NavLink="/class-teacher">Lớp Học</ListItem>
                  <ListItem NavLink="/test-teacher">Đề Thi</ListItem>
                  <ListItem NavLink="/essay-teacher">Đề Tự Luận</ListItem>
                  <ListItem NavLink="/video-teacher">Video</ListItem>
                  <ListItem NavLink="/admin">Admin</ListItem>
                </ul>
              </nav>
            </div>
            <div className="hidden justify-end pr-16 sm:flex lg:pr-0">
              <Link
                to="/auth/login"
                className="bg-primary hover:bg-primary/90 rounded-md px-3 py-3 text-base font-medium text-white"
              >
                Đăng Nhập
              </Link>

              <Link
                to="/auth/register"
                className="bg-primary hover:bg-primary/90 rounded-md px-3 py-3 text-base font-medium text-white"
              >
                Đăng Ký
              </Link>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const ListItem = ({ children, NavLink }) => {
  return (
    <>
      <li>
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
