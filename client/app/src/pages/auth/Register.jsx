import React from 'react';
import { Link } from 'react-router-dom';

export const Register = () => {
  return (
    <div class="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-4 py-6">
        <div class="w-full max-w-[480px]">
          <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 class="text-center text-3xl font-semibold text-slate-900">Đăng Ký</h1>
            <form class="mt-12 space-y-6">
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-900">Họ Và Tên</label>
                <div class="relative flex items-center">
                  <input
                    name="fullname"
                    type="text"
                    required
                    class="w-full rounded-md border border-slate-300 px-4 py-3 pr-8 text-sm text-slate-900 outline-blue-600"
                    placeholder="Nhập Họ Và Tên"
                  />
                </div>
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-900">Tên Đăng Nhập</label>
                <div class="relative flex items-center">
                  <input
                    name="username"
                    type="text"
                    required
                    class="w-full rounded-md border border-slate-300 px-4 py-3 pr-8 text-sm text-slate-900 outline-blue-600"
                    placeholder="Nhập Tên Đăng Nhập"
                  />
                </div>
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-900">Email</label>
                <div class="relative flex items-center">
                  <input
                    name="email"
                    type="email"
                    required
                    class="w-full rounded-md border border-slate-300 px-4 py-3 pr-8 text-sm text-slate-900 outline-blue-600"
                    placeholder="Nhập Email"
                  />
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-slate-900">Mật Khẩu</label>
                <div class="relative flex items-center">
                  <input
                    name="password"
                    type="password"
                    required
                    class="w-full rounded-md border border-slate-300 px-4 py-3 pr-8 text-sm text-slate-900 outline-blue-600"
                    placeholder="Nhập Mật Khẩu"
                  />
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    class="absolute right-4 h-4 w-4 cursor-pointer"
                    viewBox="0 0 128 128"
                  >
                    <path
                      d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                      data-original="#000000"
                    ></path>
                  </svg> */}
                </div>
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-900">
                  Nhập Lại Mật Khẩu
                </label>
                <div class="relative flex items-center">
                  <input
                    name="confirm_password"
                    type="password"
                    required
                    class="w-full rounded-md border border-slate-300 px-4 py-3 pr-8 text-sm text-slate-900 outline-blue-600"
                    placeholder="Nhập Lại Mật Khẩu"
                  />
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    class="absolute right-4 h-4 w-4 cursor-pointer"
                    viewBox="0 0 128 128"
                  >
                    <path
                      d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                      data-original="#000000"
                    ></path>
                  </svg> */}
                </div>
              </div>
              {/* <div class="flex flex-wrap items-center justify-between gap-4">
                <label for="remember-me" class="ml-3 block text-sm text-slate-900">
                  icon google
                </label>{' '}
                <label for="remember-me" class="ml-3 block text-sm text-slate-900">
                  icon google
                </label>
              </div> */}

              <div class="!mt-12">
                <button
                  type="button"
                  class="w-full cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-[15px] font-medium tracking-wide text-white hover:bg-blue-700 focus:outline-none"
                >
                  Đăng Ký
                </button>
              </div>
              <p class="!mt-6 text-center text-sm text-slate-900">
                Đã có tài khoản?{' '}
                <Link
                  to="/auth/login"
                  href="javascript:void(0);"
                  class="ml-1 font-semibold whitespace-nowrap text-blue-600 hover:underline"
                >
                  Đăng Nhập Tại Đây
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
