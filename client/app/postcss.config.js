// postcss.config.js
import tailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer'; // <-- bạn đang thiếu dòng này

export default {
  plugins: [
    tailwind,
    autoprefixer,
  ],
};
