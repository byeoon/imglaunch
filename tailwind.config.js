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
          "--rounded-box": "1rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0.5rem", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
        },
      },
      "black",
      "light",
      "dark" // fallback
    ],
    darkTheme: "black",
    
  },
  darkMode: ['selector', '[data-theme="black"]']
}