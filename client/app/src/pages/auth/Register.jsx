import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Hàm kiểm tra định dạng email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Hàm kiểm tra định dạng mật khẩu
  const isValidPassword = (password) => {
    const passwordRegex = /^.{6,}$/;
    return passwordRegex.test(password);
  };

  // Hàm kiểm tra định dạng tên đăng nhập
  const isValidUsername = (username) => {
    const usernameRegex = /^.{6,}$/;
    return usernameRegex.test(username);
  };

  // Xử lý thay đổi input
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

    // Kiểm tra họ và tên
    if (!formData.fullname || formData.fullname.trim().length < 2) {
      newErrors.fullname = 'Họ và tên phải có ít nhất 2 ký tự';
    }

    // Kiểm tra tên đăng nhập
    if (!formData.username || !isValidUsername(formData.username)) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 6 ký tự';
    }

    // Kiểm tra email
    if (!formData.email || !isValidEmail(formData.email)) {
      newErrors.email = 'Vui lòng nhập email hợp lệ';
    }

    // Kiểm tra mật khẩu
    if (!formData.password || !isValidPassword(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Kiểm tra xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    // Nếu có lỗi, hiển thị thông báo và dừng
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Object.values(newErrors).forEach((error) => toast.error(error));
      return;
    }

    // Nếu không có lỗi, tiến hành gửi dữ liệu lên server
    // TODO: Gửi yêu cầu đăng ký lên API
    const res = await fetch(`${process.env.VITE_API_URL}/auth/register-new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      const backendNavigate = new URL(res.url).pathname;
      navigate(backendNavigate, { replace: true });
      toast.success('Đăng ký thành công!');
    } else if (res.status == 409) {
      toast.error('Tên Đăng Nhập hoặc Email đã tồn tại');
    } else {
      toast.error('Lỗi khi đăng ký');
    }
  };

  return (
    <div className="bg-bg">
      <div className="flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-[480px]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-center text-3xl font-semibold text-slate-900">Đăng Ký</h1>
            <form className="mt-12 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Họ Và Tên</label>
                <div className="relative flex items-center">
                  <input
                    name="fullname"
                    type="text"
                    required
                    className={`w-full rounded-md border px-4 py-3 pr-8 text-sm text-slate-900 outline-blue-600 ${errors.fullname ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="Nhập Họ Và Tên"
                    value={formData.fullname}
                    onChange={handleChange}
                  />
                </div>
                {errors.fullname && <p className="mt-1 text-sm text-red-500">{errors.fullname}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Tên Đăng Nhập
                </label>
                <div className="relative flex items-center">
                  <input
                    name="username"
                    type="text"
                    required
                    className={`w-full rounded-md border px-4 py-3 pr-8 text-sm text-slate-900 outline-blue-600 ${errors.username ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="Nhập Tên Đăng Nhập"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Email</label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="email"
                    required
                    className={`w-full rounded-md border px-4 py-3 pr-8 text-sm text-slate-900 outline-blue-600 ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="Nhập Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Mật Khẩu</label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type="password"
                    required
                    className={`w-full rounded-md border px-4 py-3 pr-8 text-sm text-slate-900 outline-blue-600 ${errors.password ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="Nhập Mật Khẩu"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Nhập Lại Mật Khẩu
                </label>
                <div className="relative flex items-center">
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    className={`w-full rounded-md border px-4 py-3 pr-8 text-sm text-slate-900 outline-blue-600 ${errors.confirmPassword ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="Nhập Lại Mật Khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
              <div className="!mt-12">
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-[15px] font-medium tracking-wide text-white hover:bg-blue-700 focus:outline-none"
                >
                  Đăng Ký
                </button>
              </div>
              <p className="!mt-6 text-center text-sm text-slate-900">
                Đã có tài khoản?{' '}
                <Link
                  to="/auth/login"
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
