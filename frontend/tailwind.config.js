/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'gisd-purple': '#8B5CF6', // A vibrant purple for primary actions/highlights
        'gisd-light-blue': '#60A5FA', // A lighter blue for secondary actions/hover states
        'gisd-dark-blue': '#1F2937', // Dark blue for backgrounds/cards (similar to a dark gray)
        'gisd-sidebar-bg': '#111827', // Even darker for sidebar
        'gisd-card-bg': '#374151', // Slightly lighter dark for cards
        'gisd-card-hover': '#4B5563', // Hover state for cards
        'gisd-text-light': '#F3F4F6', // Light text for dark backgrounds
        'gisd-border': '#4A5568', // Subtle border color
      },
    },
  },
  plugins: [],
}
