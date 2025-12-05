/** @type {import('tailwindcss').Config} */
module.exports = {
  // Ensure the dark mode setting matches your useTheme hook logic
  darkMode: "class",
  content: [
    // This is the CRITICAL line: it tells Tailwind to scan all files in src/
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
