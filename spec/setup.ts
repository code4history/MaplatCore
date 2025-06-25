// Vitest global setup file
import { beforeAll, afterAll, afterEach } from "vitest";

// Global setup
beforeAll(() => {
  // Set up any global test environment
  console.log("Starting tests...");
});

// Clean up after each test
afterEach(() => {
  // Clean up DOM or any other test artifacts
  document.body.innerHTML = "";
});

// Global teardown
afterAll(() => {
  // Clean up any resources
  console.log("Tests completed.");
});

// Mock browser APIs if needed
global.URL = URL;
global.URLSearchParams = URLSearchParams;