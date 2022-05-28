module.exports = {
  verbose: true,
  transformIgnorePatterns: [
    "node_modules/(?!(ol|weiwudi)/)",
  ],
  preset: "ts-jest/presets/js-with-babel",
  transform: {
    "^.+\\.ts$": "ts-jest",
    "^.+\\.js$": "babel-jest"
  },
  globals: {
    "ts-jest": {
      tsConfig: "ts_config/tsconfig.es6.json"
    }
  },
  roots: ["<rootDir>/.."],
  testMatch: [ '**/spec/(pois)*spec.ts' ],
};
