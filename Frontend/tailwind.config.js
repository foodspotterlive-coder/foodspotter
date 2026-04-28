/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fc8019",
        "text-dark": "#282c3f",
        "text-medium": "#686b78",
        "text-light": "#93959f",
        "bg-light": "#ffffff",
        border: "#e9eaeb",
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'swiggy': '0 15px 40px -20px rgba(40,44,63,.15)',
      }
    },
  },
  plugins: [],
}
