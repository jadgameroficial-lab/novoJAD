function mockFont() {
  return { className: "mock-font", variable: "--font-mock", style: {} };
}

// Serves both `import localFont from "next/font/local"` (default export) and
// `import { Inter } from "next/font/google"` (named export) via the same aliased module.
export const Inter = mockFont;
export default mockFont;
