/* eslint-disable no-console */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { loggerError, loggerInfo, md5 } from "./utils";

describe("md5 function", () => {
  it("should return correct MD5 hash for empty string", () => {
    expect(md5("")).toBe("d41d8cd98f00b204e9800998ecf8427e");
  });

  it("should return correct MD5 hash for test string", () => {
    expect(md5("test")).toBe("098f6bcd4621d373cade4e832627b4f6");
  });

  it("should return correct MD5 hash for longer strings", () => {
    expect(md5("The quick brown fox jumps over the lazy dog")).toBe(
      "9e107d9d372bb6826bd81d3542a419d6",
    );
  });

  it("should handle special characters", () => {
    expect(md5("!@#$%^&*()")).toBe("05b28d17a7b6e7024b6e5d8cc43a8bf7");
  });

  it("should handle email", () => {
    expect(md5("test_1.005@sovendus.com")).toBe(
      "f3ddc7a5389375e43fb93754ba4479b5",
    );
  });

  it("should trim spaces", () => {
    expect(md5(" test_1.005@sovendus.com ")).toBe(
      "f3ddc7a5389375e43fb93754ba4479b5",
    );
  });

  it("should handle Unicode characters", () => {
    expect(md5("こんにちは")).toBe("c0e89a293bd36c7a768e4e9d2c5475a8");
  });

  it("should produce consistent results for the same input", () => {
    const input = "Consistency test";
    expect(md5(input)).toBe(md5(input));
  });
});

describe("Logger functions", () => {
  beforeEach(() => {
    // Mock console methods before each test
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore the original implementations
    vi.restoreAllMocks();
  });

  describe("loggerInfo function", () => {
    it("should log with correct format for Landing Page", () => {
      loggerInfo("test message", "LandingPage");
      expect(console.log).toHaveBeenCalledWith(
        "Sovendus App [LandingPage] - test message",
      );
    });

    it("should log with correct format for Thank You Page", () => {
      loggerInfo("test message", "ThankyouPage");
      expect(console.log).toHaveBeenCalledWith(
        "Sovendus App [ThankyouPage] - test message",
      );
    });

    it("should handle additional parameters", () => {
      const additionalData = { foo: "bar" };
      loggerInfo("test message", "LandingPage", additionalData);
      expect(console.log).toHaveBeenCalledWith(
        "Sovendus App [LandingPage] - test message",
        additionalData,
      );
    });
  });

  describe("loggerError function", () => {
    it("should log errors with correct format for Landing Page", () => {
      loggerError("error message", "LandingPage");
      expect(console.error).toHaveBeenCalledWith(
        "Sovendus App [LandingPage] - error message",
      );
    });

    it("should log errors with correct format for Thank You Page", () => {
      loggerError("error message", "ThankyouPage");
      expect(console.error).toHaveBeenCalledWith(
        "Sovendus App [ThankyouPage] - error message",
      );
    });

    it("should handle additional parameters for errors", () => {
      const error = new Error("Sample error");
      loggerError("error message", "LandingPage", error);
      expect(console.error).toHaveBeenCalledWith(
        "Sovendus App [LandingPage] - error message",
        error,
      );
    });
  });
});
