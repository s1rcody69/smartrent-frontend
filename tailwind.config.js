/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary Palette - Midnight Navy
        primary: "#0B1C30",
        "primary-container": "#131b2e",
        "on-primary": "#ffffff",
        "on-primary-container": "#7c839b",

        // Secondary Palette - Electric Indigo
        secondary: "#4648D4",
        "secondary-container": "#6063EE",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#fffbff",
        "secondary-fixed": "#e1e0ff",
        "secondary-fixed-dim": "#c0c1ff",
        "on-secondary-fixed": "#07006c",
        "on-secondary-fixed-variant": "#2f2ebe",

        // Accent - Lighter Indigo
        accent: "#6063EE",
        "accent-light": "#e5eeff",

        // Adjacent - Light Background
        adjacent: "#F8F9FF",
        "adjacent-bright": "#f8f9ff",
        "adjacent-dim": "#cbdbf5",

        // Surface
        surface: "#f8f9ff",
        "surface-bright": "#f8f9ff",
        "surface-dim": "#cbdbf5",
        "surface-container": "#e5eeff",
        "surface-container-low": "#eff4ff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "surface-container-lowest": "#ffffff",

        // Text
        "on-surface": "#0b1c30",
        "on-surface-variant": "#45464d",

        // Outline
        outline: "#76777d",
        "outline-variant": "#c6c6cd",

        // Background
        background: "#f8f9ff",
        "on-background": "#0b1c30",

        // Error
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        // Success (custom additions)
        success: "#22c55e",
        "success-container": "#dcfce7",
        "on-success": "#ffffff",

        // Warning (custom additions)
        warning: "#f59e0b",
        "warning-container": "#fef3c7",
        "on-warning": "#ffffff",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },
      spacing: {
        gutter: "24px",
        "container-max": "1440px",
        base: "4px",
        "margin-desktop": "40px",
        "margin-mobile": "16px",
      },
      fontFamily: {
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Inter", "sans-serif"],
        "label-md": ["Geist", "sans-serif"],
        "label-sm": ["Geist", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.02em", fontWeight: "500" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "600" }],
      },
    },
  },
  plugins: [],
}