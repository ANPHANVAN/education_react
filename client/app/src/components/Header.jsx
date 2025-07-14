import React from 'react';
import { Link } from 'react-router-dom';
export const Header = () => {
  const [openHeader, setOpenHeader] = React.useState(false);
  const handleOpenHeader = () => {
    setOpenHeader(!openHeader);
  };

  return (
    <header class="sticky top-0 z-50 flex min-h-[60px] bg-white px-4 py-0 tracking-wide shadow-md sm:px-10">
      <div class="flex w-full flex-wrap items-center justify-between gap-5">
        <Link to="/" class="max-sm:hidden">
          <h1 className="m-0">Education</h1>
        </Link>

        <div
          id="collapseMenu"
          className="items-center max-lg:hidden max-lg:before:fixed max-lg:before:inset-0 max-lg:before:z-50 max-lg:before:bg-black max-lg:before:opacity-50 lg:!block"
          style={{ display: openHeader ? 'block' : 'none' }}
        >
          <button
            id="toggleClose"
            class="fixed top-2 right-[30px] z-[100] flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white lg:hidden"
            onClick={handleOpenHeader}
          >
            X
          </button>

          <ul class="z-50 mb-0 gap-x-1 max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:h-full max-lg:w-1/2 max-lg:min-w-[300px] max-lg:space-y-3 max-lg:overflow-auto max-lg:bg-white max-lg:p-6 max-lg:shadow-md md:mt-0 lg:flex">
            <li class="mb-6 hidden max-lg:block">
              <Link to="/" class="max-sm:hidden">
                <h1 className="m-0">Education</h1>
              </Link>
            </li>
            <li class="px-3 max-lg:border-b max-lg:border-gray-300 max-lg:py-3">
              <Link
                to="/home-student"
                class="block text-[15px] font-medium text-slate-900 hover:text-blue-700"
              >
                Học Sinh
              </Link>
            </li>
            <li class="px-3 max-lg:border-b max-lg:border-gray-300 max-lg:py-3">
              <Link
                to="/class-teacher"
                class="block text-[15px] font-medium text-slate-900 hover:text-blue-700"
              >
                Lớp Học
              </Link>
            </li>
            <li class="px-3 max-lg:border-b max-lg:border-gray-300 max-lg:py-3">
              <Link
                to="/test-teacher"
                class="block text-[15px] font-medium text-slate-900 hover:text-blue-700"
              >
                Đề Thi
              </Link>
            </li>
            <li class="px-3 max-lg:border-b max-lg:border-gray-300 max-lg:py-3">
              <Link
                to="/essay-teacher"
                class="block text-[15px] font-medium text-slate-900 hover:text-blue-700"
              >
                Đề Tự Luận
              </Link>
            </li>
            <li class="px-3 max-lg:border-b max-lg:border-gray-300 max-lg:py-3">
              <Link
                to="/video-teacher"
                class="block text-[15px] font-medium text-slate-900 hover:text-blue-700"
              >
                Video
              </Link>
            </li>
            <li class="px-3 max-lg:border-b max-lg:border-gray-300 max-lg:py-3">
              <Link
                to="/admin"
                class="block text-[15px] font-medium text-slate-900 hover:text-blue-700"
              >
                Admin
              </Link>
            </li>
          </ul>
        </div>

        <div class="flex items-center space-x-4 max-lg:ml-auto">
          <Link to="/me">
            <button class="cursor-pointer rounded-full border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium tracking-wide text-slate-900 transition-all hover:bg-gray-50">
              Profile
            </button>
          </Link>
          <Link to="/auth/login">
            <button class="cursor-pointer rounded-full border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium tracking-wide text-slate-900 transition-all hover:bg-gray-50">
              Đăng Nhập
            </button>
          </Link>
          <Link to="/auth/register">
            <button class="cursor-pointer rounded-full border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium tracking-wide text-white transition-all hover:bg-blue-700">
              Đăng Ký
            </button>
          </Link>

          <button id="toggleOpen" className="cursor-pointer lg:hidden" onClick={handleOpenHeader}>
            <svg class="h-7 w-7" fill="#000" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
