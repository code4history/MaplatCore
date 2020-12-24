module.exports = {
  verbose: true,
  setupFiles: ["jest-canvas-mock"],
  transformIgnorePatterns: [
    "node_modules/(?!(ol|weiwudi)/)",
  ],
  preset: 'ts-jest/presets/js-with-babel',
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
};
