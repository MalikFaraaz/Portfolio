import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        panel: "var(--panel)",
        ink: "var(--ink)",
        mute: "var(--mute)",
        line: "var(--line)",
        accent: "var(--a)",
        accent2: "var(--a2)",
        code: "var(--code)",
        codeink: "var(--codeink)",
      },
      fontFamily: {
        sans: ["var(--f)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["var(--m)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      maxWidth: {
        container: "1180px",
      },
      borderRadius: {
        card: "26px",
        btn: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
