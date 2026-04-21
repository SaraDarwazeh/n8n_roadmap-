import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}", "./N8nLearningRoadmap.tsx"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 20px 60px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;