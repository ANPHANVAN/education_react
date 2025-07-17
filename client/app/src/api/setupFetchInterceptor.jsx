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
      alert('Phiên Đăng Nhập Hết Hạn, Hãy Đăng Nhập Lại');
      return (window.location.href = '/auth/login');
    }
    return response;
  };
};
