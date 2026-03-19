/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // ============ COLORS ============
      colors: {
        primary: {
          DEFAULT: "#6366f1",  // main purple/indigo
          hover: "#4f46e5",    // darker on hover
          light: "#e0e7ff",    // light bg for primary
        },
        light: {
          bg: "#ffffff",       // page background
          sidebar: "#f3f4f6", // sidebar background
          card: "#ffffff",     // card background
          input: "#f3f4f6",   // input background
          border: "#e5e7eb",  // borders
          text: "#111827",    // main text
          subtext: "#6b7280", // secondary text
          hover: "#f9fafb",   // hover background
        },
        dark: {
          bg: "#030712",       // page background
          sidebar: "#111827", // sidebar background
          card: "#1f2937",    // card background
          input: "#1f2937",   // input background
          border: "#374151",  // borders
          text: "#f9fafb",    // main text
          subtext: "#9ca3af", // secondary text
          hover: "#374151",   // hover background
        },
      },

      // ============ FONT SIZES ============
      fontSize: {
        xs: "0.75rem",      // 12px - tiny labels
        sm: "0.875rem",     // 14px - small text
        base: "1rem",       // 16px - body text
        lg: "1.125rem",     // 18px - slightly larger
        xl: "1.25rem",      // 20px - subheadings
        "2xl": "1.5rem",    // 24px - headings
        "3xl": "1.875rem",  // 30px - large headings
        "4xl": "2.25rem",   // 36px - page titles
      },

      // ============ FONT FAMILY ============
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Fira Code", "monospace"], // for code blocks in chat
      },

      // ============ SPACING ============
      spacing: {
        sidebar: "280px",   // sidebar width
        "sidebar-sm": "72px", // collapsed sidebar width
        header: "60px",     // header height
        "chat-input": "80px", // chat input height
      },

      // ============ BORDER RADIUS ============
      borderRadius: {
        none: "0",
        sm: "0.25rem",      // 4px
        DEFAULT: "0.375rem", // 6px
        md: "0.5rem",       // 8px
        lg: "0.75rem",      // 12px
        xl: "1rem",         // 16px
        "2xl": "1.5rem",    // 24px - cards
        full: "9999px",     // pills/avatars
      },

      // ============ BOX SHADOW ============
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        DEFAULT: "0 1px 3px rgba(0,0,0,0.1)",
        md: "0 4px 6px rgba(0,0,0,0.1)",
        lg: "0 10px 15px rgba(0,0,0,0.1)",
        card: "0 2px 8px rgba(0,0,0,0.08)",
        "card-dark": "0 2px 8px rgba(0,0,0,0.4)",
      },

      // ============ SCREEN SIZES ============
      screens: {
        sm: "640px",   // mobile landscape
        md: "768px",   // tablet
        lg: "1024px",  // laptop
        xl: "1280px",  // desktop
        "2xl": "1536px", // large desktop
      },

      // ============ Z-INDEX ============
      zIndex: {
        sidebar: "40",
        header: "50",
        modal: "60",
        tooltip: "70",
      },

      // ============ TRANSITIONS ============
      transitionDuration: {
        fast: "150ms",
        DEFAULT: "200ms",
        slow: "300ms",
      },

      // ============ MAX WIDTH ============
      maxWidth: {
        chat: "768px",    // max width of chat messages
        sidebar: "280px", // max sidebar width
      },

      // ============ HEIGHT ============
      height: {
        header: "60px",
        "chat-input": "80px",
        screen: "100vh",
      },

      // ============ WIDTH ============
      width: {
        sidebar: "280px",
        "sidebar-sm": "72px",
      },
    },
  },
  plugins: [],
}