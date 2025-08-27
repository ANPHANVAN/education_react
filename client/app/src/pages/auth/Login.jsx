import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Loading } from '@/components';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Hàm kiểm tra định dạng tên đăng nhập
  const isValidUsername = (username) => {
    const usernameRegex = /^.{3,}$/;
    return usernameRegex.test(username);
  };

  // Hàm kiểm tra định dạng mật khẩu
  const isValidPassword = (password) => {
    const passwordRegex = /^.{6,}$/;
    return passwordRegex.test(password);
  };

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Kiểm tra tên đăng nhập
    if (!formData.username || !isValidUsername(formData.username)) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    // Kiểm tra mật khẩu
    if (!formData.password || !isValidPassword(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Nếu có lỗi, hiển thị thông báo và dừng
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Object.values(newErrors).forEach((error) => toast.error(error));
      return;
    }

    // Gửi yêu cầu API
    setIsLoading(true);
    try {
      const res = await fetch(`${VITE_API_URL}/auth/login/authentication`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (res.ok) {
        toast.success('Đăng nhập thành công!');
        const urlNavigate = new URL(res.url).pathname;
        return window.location.replace('/');
        // return navigate(urlNavigate, { replace: true }); // Điều hướng theo backend
      } else {
        if (res.status === 404) {
          return toast.error('Tên đăng nhập không tồn tại!');
        } else if (res.status === 401) {
          return toast.error('Mật khẩu không chính xác!');
        } else {
          return toast.error('Lỗi hệ thống, vui lòng thử lại sau!');
        }
      }
    } catch (error) {
      return toast.error('Lỗi kết nối: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark:bg-bg bg-gray-50">
      {isLoading && <Loading />}
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
                    className={`w-full rounded-md border px-4 py-3 pr-8 text-sm text-slate-900 outline-blue-600 ${
                      errors.username ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Nhập Tên Đăng Nhập"
                  />
                </div>
                {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Mật Khẩu</label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-md border px-4 py-3 pr-12 text-sm text-slate-900 outline-blue-600 ${
                      errors.password ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Nhập Mật Khẩu"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="absolute right-4 h-4 w-4 cursor-pointer"
                    viewBox="0 0 128 128"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <path
                      d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                      data-original="#000000"
                    />
                  </svg>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>
              <div className="flex flex-wrap items-center justify-end gap-4">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  Quên Mật Khẩu?
                </Link>
              </div>
              <div className="!mt-12">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full rounded-md px-4 py-2 text-[15px] font-medium tracking-wide text-white focus:outline-none ${
                    isLoading
                      ? 'cursor-not-allowed bg-blue-400'
                      : 'cursor-pointer bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Đăng Nhập
                </button>
              </div>
              <p className="!mt-6 text-center text-sm text-slate-900">
                Không có tài khoản?{' '}
                <Link
                  to="/auth/register"
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
