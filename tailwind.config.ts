import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2fbf9",
          100: "#d5f5eb",
          200: "#aeead7",
          300: "#7ad7bd",
          400: "#48b99d",
          500: "#2f9f84",
          600: "#227c66",
          700: "#1d6353",
          800: "#1b5044",
          900: "#183f35"
        }
      }
    }
  },
  plugins: []
};

export default config;
