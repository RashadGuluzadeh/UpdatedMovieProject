const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Soft, low-glare dark palette: no pure black or pure white,
      // so text and surfaces stay easy on the eyes for long sessions.
      colors: {
        ink: "#0f1116",        // page background
        surface: "#171a21",    // cards, panels
        raised: "#1f232c",     // inputs, hovered surfaces
        line: "#2a2f3a",       // borders, dividers
        fg: "#e4e6eb",         // primary text
        muted: "#9ba3b4",      // secondary text
        subtle: "#6b7385",     // hints, placeholders
        accent: {
          DEFAULT: "#8b95f7",  // soft periwinkle
          strong: "#717ce8",
        },
        star: "#f0c060",
        // Chart colors, validated against the surface for the dark band,
        // contrast and colorblind separation (rise vs fall).
        chart: "#9085e9",
        rise: "#199e70",
        fall: "#d95926",
        danger: "#e88080",
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['"Josefin Sans"', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        soft: "0 8px 30px -12px rgba(0, 0, 0, 0.6)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "pop-in": {
          from: { opacity: "0", transform: "translateY(12px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "page-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "pop-in": "pop-in 250ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        "page-in": "page-in 350ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards",
      },
    },
  },
  plugins: [],
};
