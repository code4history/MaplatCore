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

  // https://stackoverflow.com/a/54513338
  moduleNameMapper: {
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/spec/fileMock.ts",
    "\\.(css|less)$": "<rootDir>/spec/fileMock.ts"
  }
};
