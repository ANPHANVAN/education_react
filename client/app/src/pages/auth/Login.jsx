import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const VITE_API_URL = import.meta.env.VITE_API_URL;

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.username.trim()) tempErrors.username = 'Tên đăng nhập là bắt buộc.';
    if (!formData.password.trim()) tempErrors.password = 'Mật khẩu là bắt buộc.';
    else if (formData.password.length < 6)
      tempErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle login logic here (e.g., API call)
      console.log('Form submitted:', formData);
      const res = await fetch(`${VITE_API_URL}/auth/login/authentication`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      if (res.ok) {
        navigate('/', { replace: true });
      } else {
        console.log('failure to login');
      }
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-[480px]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-center text-3xl font-semibold text-slate-900">Đăng Nhập</h1>
            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Tên Đăng Nhập
                </label>
                <div className="relative flex items-center">
                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-md border border-slate-300 px-4 py-3 pr-8 text-sm text-slate-900 outline-blue-600 ${
                      errors.username ? 'border-red-500' : ''
                    }`}
                    placeholder="Nhập Tên Đăng Nhập"
                  />
                  {errors.username && (
                    <p className="mt-1 text-xs text-red-500">{errors.username}</p>
                  )}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="absolute right-4 h-4 w-4"
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
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Mật Khẩu</label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-md border border-slate-300 px-4 py-3 pr-8 text-sm text-slate-900 outline-blue-600 ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                    placeholder="Nhập Mật Khẩu"
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                  )}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="absolute right-4 h-4 w-4 cursor-pointer"
                    viewBox="0 0 128 128"
                  >
                    <path
                      d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-4">
                <div className="text-sm">
                  <Link
                    to="/auth/forgot-password"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Quên Mật Khẩu?
                  </Link>
                </div>
              </div>

              <div className="!mt-12">
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-[15px] font-medium tracking-wide text-white hover:bg-blue-700 focus:outline-none"
                >
                  Đăng Nhập
                </button>
              </div>
              <p className="!mt-6 text-center text-sm text-slate-900">
                Không có tài khoản?{' '}
                <Link
                  to="/auth/register"
                  href="javascript:void(0);"
                  className="ml-1 font-semibold whitespace-nowrap text-blue-600 hover:underline"
                >
                  Đăng Ký Tại Đây
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
