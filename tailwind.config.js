import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cacao: "#362E28",
        cream: "#F4EBDD",
        clay: "#7C3C3C",
        bone: "#FBF7EF",
        rosewood: "#5C2B2B",
        oat: "#DCCDB8",
        sage: "#A8A091",
        mauve: "#B98E86",
        charcoal: "#43372F",
      },
      fontFamily: {
        serif: ["Aboreto", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["Montserrat", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [typography],
};
