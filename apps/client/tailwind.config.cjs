/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        dark: "0 2px 12px 0 rgb(0 0 0 / 0.2)",
        top: "0 -2px 12px 0 rgb(0 0 0 / 0.2)",
      },
      dropShadow: {
        dark: "0 2px 16px rgba(0, 0, 0, 0.8)",
      },
    },
  },
};
