import React, { useEffect, useState } from 'react';

export const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleDarkMode = () => {
    const root = document.documentElement;
    root.classList.toggle('dark');
    setIsDark(root.classList.contains('dark'));
    // Optional: lưu vào localStorage
    localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
  };

  useEffect(() => {
    // Load từ localStorage nếu có
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  return (
    <button
      onClick={toggleDarkMode}
      className="rounded bg-gray-200 px-4 py-2 text-sm dark:bg-gray-700 dark:text-blue-200"
    >
      {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
};
