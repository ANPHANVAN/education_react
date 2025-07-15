module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // background: 'var(--color-background)',
        // content: 'var(--color-content)',
        // primary: 'var(--color-primary)',
        // muted: 'var(--color-muted)',
        // tertiary: 'var(--color-tertiary)',
        // surface: 'var(--color-surface)',
        // accent: 'var(--color-accent)',
        // secondary: 'var(--color-secondary)',
        header: 'var(--color-header)',
        background: 'var(--color-bg)',
        content: 'var(--color-text)',
        primary: {
          from: 'var(--color-primary-from)',
          to: 'var(--color-primary-to)',
        },
        surface: 'var(--color-surface)',
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
