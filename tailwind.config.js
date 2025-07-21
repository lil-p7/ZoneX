/** @type {import('tailwindcss').Config} */
export const content = [
  "./App.tsx",
  "./app/**/*.{ts,tsx,js,jsx}",
  "./components/**/*.{js,jsx,ts,tsx}",
];
export const presets = [require("nativewind/preset")];
export const theme = {
  extend: {},
};
export const plugins = [];
