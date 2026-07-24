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
          DEFAULT: "#0b69ff",
          dark: "#063b9e",
          hover: "#0957d6",
        },
        // Accent
        accent: {
          DEFAULT: "#7c3aed",
          hover: "#6d28d9",
        },
        // Brand backgrounds
        brand: {
          bg: "#0b1220",
          surface: "#0f1724",
          card: "#151f2e",
          border: "#1e2d42",
          hover: "#1a2840",
        },
        // Semantic
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        info: "#3b82f6",
        // Text
        muted: "#9aa4b2",
        subtle: "#6b7a8f",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
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
        card: "8px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.4)",
        modal: "0 8px 32px 0 rgba(0,0,0,0.5)",
        subtle: "0 1px 2px 0 rgba(0,0,0,0.2)",
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
    },
  },
  plugins: [],
};
