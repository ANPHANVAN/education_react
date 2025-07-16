import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ResetOTP = () => {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  // Hàm kiểm tra định dạng email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

    // Nếu có lỗi, hiển thị thông báo và dừng
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Object.values(newErrors).forEach((error) => toast.error(error));
      return;
    }

    // Nếu không có lỗi, tiến hành gửi dữ liệu lên server
    // TODO: Gửi yêu cầu đăng ký lên API
    console.log('formSubmit: ', formData);
    const res = await fetch(`${process.env.VITE_API_URL}/auth/api/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      toast.success('OTP đã được gửi tới email!');
      return navigate('/auth/reset-password');
    } else if (res.status == 404) {
      return toast.error('Email chưa đăng ký tài khoản, hãy tạo tài khoản');
    } else {
      return toast.error('Internal Server Error, Hãy Thông Báo Cho Giáo Viên Hoặc Bộ Phận Hỗ Trợ');
    }
  };

  return (
    <div className="bg-bg">
      <div className="flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-[480px]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-center text-3xl font-semibold text-slate-900">Reset Password</h1>
            <form className="mt-12 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Gmail</label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="email"
                    required
                    onChange={handleChange}
                    input={formData.email}
                    className={`w-full rounded-md border px-4 py-3 pr-8 text-sm text-slate-900 outline-blue-600 ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="Nhập Gmail"
                  />
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
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              <div className="!mt-12">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-[15px] font-medium tracking-wide text-white hover:bg-blue-700 focus:outline-none"
                >
                  Gửi Mã Xác Nhận
                </button>
              </div>
              <p className="!mt-6 text-center text-sm text-slate-900">
                Đã có tài khoản?{' '}
                <Link
                  to="/auth/login"
                  href="javascript:void(0);"
                  className="ml-1 font-semibold whitespace-nowrap text-blue-600 hover:underline"
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
