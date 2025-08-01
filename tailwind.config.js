/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.html", "./src/**/*.js"],

  theme: {
    extend: {
      colors: {
         'soft-gray': '#E5E7EB', // Custom background color
        'deep-blue': '#1E3A8A', // Primary color for buttons, headers
        'teal': '#2DD4BF', // Accent color for buttons, tags
        'charcoal': '#1F2937', // Text color
        'coral-red': '#F87171', // Error color
        'forest-green': '#10B981', // Success color
      },
      fontFamily:{
         ubuntu: ['Ubuntu', sans-serif],
      }
    },
  },
  plugins: [],
}