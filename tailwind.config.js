/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/public/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
  themes: [
      {
        black: {
          ...require("daisyui/src/theming/themes")["black"],
          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
        },
      },
      "black",
      "light",
    ],
    darkTheme: "black",
    
  },
  darkMode: ['selector', '[data-theme="black"]']
}