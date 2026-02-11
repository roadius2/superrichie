import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        richie: {
          black: "#000000",
          green: "#00ff00",
          "green-dark": "#00cc00",
          "green-light": "#66ff66",
        },
      },
    },
  },
  plugins: [],
};
export default config;
