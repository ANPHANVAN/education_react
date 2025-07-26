import { toast } from 'react-toastify';
export const setupFetchInterceptor = () => {
  const originalFetch = window.fetch;

  window.fetch = async (input, init = {}) => {
    const response = await originalFetch(input, {
      ...init,
      credentials: 'include', // luôn gửi cookie
    });
    const urlPathname = new URL(response.url).pathname;

    const currentUrl = new URL(window.location.href).pathname;
    if (currentUrl == '/auth/login') {
      return response;
    }
    if (response.redirected && urlPathname == '/auth/login') {
      toast.info('Phiên Đăng Nhập Hết Hạn, Hãy Đăng Nhập Lại', {
        autoClose: 3000,
      });
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 3000);
      // alert('Phiên Đăng Nhập Hết Hạn, Hãy Đăng Nhập Lại');
      return;
    }
    return response;
  };
};
