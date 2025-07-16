import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Hàm kiểm tra định dạng email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const isValidOTP = (otp) => {
    const otpRegex = /^[0-9]{1,6}$/;
    return otpRegex.test(otp);
  };
  // Hàm kiểm tra định dạng mật khẩu
  const isValidPassword = (password) => {
    const passwordRegex = /^.{6,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Xóa lỗi của trường khi người dùng bắt đầu nhập lại
    setErrors({ ...errors, [name]: '' });
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    // Kiểm tra email
    if (!formData.email || !isValidEmail(formData.email)) {
      newErrors.email = 'Vui lòng nhập email hợp lệ';
    }
    // Kiểm tra otp
    if (!formData.otp || !isValidOTP(formData.otp)) {
      newErrors.otp = 'Vui lòng nhập otp hợp lệ';
    }
    // Kiểm tra password
    if (!formData.newPassword || !isValidPassword(formData.newPassword)) {
      newErrors.newPassword = 'Mật Khẩu Mới tối thiểu 6 ký tự';
    }

    // Nếu có lỗi, hiển thị thông báo và dừng
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Object.values(newErrors).forEach((error) => toast.error(error));
      return;
    }

    // Nếu không có lỗi, tiến hành gửi dữ liệu lên server
    const res = await fetch(`${process.env.VITE_API_URL}/auth/api/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      toast.success('Đã Đặt Lại Mật Khẩu Thành Công!');
      return navigate('/auth/login');
    } else if (res.status == 404) {
      return toast.error('Không tìm thấy tài khoản nào với Email này');
    } else if (res.status == 400) {
      return toast.error('OTP không hợp lệ hoặc đã hết hạn');
    } else {
      return toast.error('Thất bại trong việc thay đổi mật khẩu hoặc Lỗi Hệ Thống');
    }
  };

  return (
    <div class="bg-bg">
      <div class="flex flex-col items-center justify-center px-4 py-6">
        <div class="w-full max-w-[480px]">
          <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 class="text-center text-3xl font-semibold text-slate-900">Khôi Phục Mật Khẩu</h1>
            <form class="mt-12 space-y-6">
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-900">Email</label>
                <div class="relative flex items-center">
                  <input
                    name="email"
                    type="email"
                    required
                    onChange={handleChange}
                    value={formData.email}
                    class="w-full rounded-md border border-slate-300 px-4 py-3 pr-8 text-sm text-slate-900 outline-blue-600"
                    placeholder="Nhập Email"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-900">Mã OTP</label>
                <div class="relative flex items-center">
                  <input
                    name="otp"
                    type="text"
                    required
                    onChange={handleChange}
                    value={formData.otp}
                    class="w-full rounded-md border border-slate-300 px-4 py-3 pr-8 text-sm text-slate-900 outline-blue-600"
                    placeholder="Nhập Mã OTP"
                  />
                </div>
                {errors.otp && <p className="mt-1 text-sm text-red-500">{errors.otp}</p>}
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-900">Mật Khẩu Mới</label>
                <div class="relative flex items-center">
                  <input
                    name="newPassword"
                    type="password"
                    required
                    onChange={handleChange}
                    value={formData.newPassword}
                    class="w-full rounded-md border border-slate-300 px-4 py-3 pr-8 text-sm text-slate-900 outline-blue-600"
                    placeholder="Nhập Mật Khẩu Mới"
                  />
                  <svg
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
                  </svg>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
                )}
              </div>

              <div class="!mt-12">
                <button
                  type="button"
                  onClick={handleSubmit}
                  class="w-full cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-[15px] font-medium tracking-wide text-white hover:bg-blue-700 focus:outline-none"
                >
                  Khôi Phục Mật Khẩu
                </button>
              </div>
              <p class="!mt-6 text-center text-sm text-slate-900">
                Không có tài khoản?{' '}
                <Link
                  to="/auth/register"
                  href="javascript:void(0);"
                  class="ml-1 font-semibold whitespace-nowrap text-blue-600 hover:underline"
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
