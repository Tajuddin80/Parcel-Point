module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: '#4f46e5', // e.g. Indigo-600
        'brand-dark': '#4338ca',
      },
    },
  },
  plugins: [require('daisyui')],
};
