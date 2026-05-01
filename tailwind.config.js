/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cacao: "#241915",
        cream: "#F4EBDD",
        clay: "#9E4F49",
        bone: "#FBF7EF",
        rosewood: "#6F3432",
        oat: "#DCCDB8",
        sage: "#A8A091",
        mauve: "#B98E86",
        charcoal: "#352A25",
      },
      fontFamily: {
        serif: ['"EB Garamond"', "Garamond", "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
