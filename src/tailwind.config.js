/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite-react/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary
        primary: {
          DEFAULT: "#2B2B2B",
          dark: "#171717",
          hover: "#454545",
        },
        // Accent
        accent: {
          DEFAULT: "#2B2B2B",
          hover: "#454545",
        },
        secondary: {
          DEFAULT: "#2B9C5A",
          dark: "#217A45",
          hover: "#1B6539",
        },
        // Brand backgrounds
        brand: {
          bg: "#F8F8F8",
          surface: "#FFFFFF",
          card: "#FFFFFF",
          border: "#E8E8E8",
          hover: "#F1F1F1",
        },
        // Semantic
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        info: "#3b82f6",
        // Text
        muted: "#6E6E6E",
        subtle: "#858585",
      },
      fontFamily: {
        sans: [
          "Avenir Next",
          "Nunito Sans",
          "Trebuchet MS",
          "ui-rounded",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      fontSize: {
        h1: ["28px", {lineHeight: "1.2", fontWeight: "700"}],
        h2: ["20px", {lineHeight: "1.2", fontWeight: "600"}],
        h3: ["16px", {lineHeight: "1.3", fontWeight: "600"}],
        body: ["14px", {lineHeight: "1.4", fontWeight: "400"}],
        sm: ["12px", {lineHeight: "1.4", fontWeight: "400"}],
      },
      spacing: {
        18: "4.5rem",
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(43,43,43,0.04)",
        modal: "0 8px 32px 0 rgba(43,43,43,0.12)",
        subtle: "0 1px 2px 0 rgba(43,43,43,0.03)",
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
    },
  },
  plugins: [],
};
