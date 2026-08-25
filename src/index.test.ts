import { describe, it, expect } from "vitest";
import { version } from "./index.js";

describe("index", () => {
  it("exports a version string", () => {
    expect(typeof version).toBe("string");
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
