import { CountryCodes } from "sovendus-integration-types";
import { describe, expect, it } from "vitest";

import type { SovendusThankyouPage } from "../thankyou-page-handler";
import { detectLanguageCode } from "./detect-language-code";

describe("detectLanguageCode", () => {
  it("should return language from document.documentElement.lang (lowercase)", () => {
    Object.defineProperty(document.documentElement, "lang", {
      value: "en-GB",
      writable: true,
    });

    const result = detectLanguageCode.call(
      {} as SovendusThankyouPage,
      CountryCodes.GB,
    );

    expect(result).toBe("en");
  });

  it("should return language from navigator.language when document lang is empty (lowercase)", () => {
    Object.defineProperty(document.documentElement, "lang", {
      value: "",
      writable: true,
    });

    Object.defineProperty(navigator, "language", {
      value: "de-DE",
      writable: true,
    });

    const result = detectLanguageCode.call(
      {} as SovendusThankyouPage,
      CountryCodes.DE,
    );

    expect(result).toBe("de");
  });

  it("should handle language codes with regions (returns lowercase)", () => {
    Object.defineProperty(document.documentElement, "lang", {
      value: "fr-BE",
      writable: true,
    });

    const result = detectLanguageCode.call(
      {} as SovendusThankyouPage,
      CountryCodes.BE,
    );

    expect(result).toBe("fr");
  });

  it("should prefer document language even when a country is provided", () => {
    Object.defineProperty(document.documentElement, "lang", {
      value: "it-CH",
      writable: true,
    });
    Object.defineProperty(navigator, "language", {
      value: "de-DE",
      writable: true,
    });

    const result = detectLanguageCode.call(
      {} as SovendusThankyouPage,
      CountryCodes.CH,
    );

    expect(result).toBe("it");
  });

  it("should fall back to a default language when both doc and nav are empty (single-language country)", () => {
    Object.defineProperty(document.documentElement, "lang", {
      value: "",
      writable: true,
    });
    Object.defineProperty(navigator, "language", {
      value: "",
      writable: true,
    });

    const result = detectLanguageCode.call(
      {} as SovendusThankyouPage,
      CountryCodes.DE,
    );

    expect(result).toBe("DE");
  });

  it("should return undefined when no language is available and no country is known", () => {
    Object.defineProperty(document.documentElement, "lang", {
      value: "",
      writable: true,
    });

    Object.defineProperty(navigator, "language", {
      value: "",
      writable: true,
    });

    const result = detectLanguageCode.call(
      {} as SovendusThankyouPage,
      undefined as unknown as CountryCodes,
    );

    expect(result).toBeUndefined();
  });
});
