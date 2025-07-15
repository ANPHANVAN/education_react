import React from 'react';
import { Link } from 'react-router-dom';

export const ResetOTP = () => {
  return (
    <div class="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-4 py-6">
        <div class="w-full max-w-[480px]">
          <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 class="text-center text-3xl font-semibold text-slate-900">Reset Password</h1>
            <form class="mt-12 space-y-6">
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-900">Gmail</label>
                <div class="relative flex items-center">
                  <input
                    name="email"
                    type="email"
                    required
                    class="w-full rounded-md border border-slate-300 px-4 py-3 pr-8 text-sm text-slate-900 outline-blue-600"
                    placeholder="Nhập Gmail"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    class="absolute right-4 h-4 w-4"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                    <path
                      d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>
              <div class="!mt-12">
                <button
                  type="button"
                  class="w-full cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-[15px] font-medium tracking-wide text-white hover:bg-blue-700 focus:outline-none"
                >
                  Gửi Mã Xác Nhận
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
