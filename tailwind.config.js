/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        press: ["'Press Start 2P'", 'cursive'],
        joystick: ['Joystick', 'monospace'],
        gumball: ['Gumball', 'monospace'],
        fipps: ['Fipps', 'monospace']
      }
    }
  },
  plugins: []
};
