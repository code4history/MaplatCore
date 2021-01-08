module.exports = {
  verbose: true,
  transformIgnorePatterns: [
    "node_modules/(?!(ol|weiwudi)/)",
  ],
  preset: "ts-jest/presets/js-with-babel",
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  roots: ["<rootDir>/.."],
  testMatch: [ '**/spec/(pois|template)*spec.ts' ],
};
