import type { SovendusPageUrlParams } from "sovendus-integration-types";
import { describe, expect, it } from "vitest";

import type { SovendusThankyouPage } from "../thankyou-page-handler";
import { clearCookie } from "./clear-cookie";

// Mock window.location and document.cookie
Object.defineProperty(window, "location", {
  value: {
    hostname: "example.com",
  },
  writable: true,
});

Object.defineProperty(document, "cookie", {
  writable: true,
  value: "",
});

describe("clearCookie", () => {
  it("should set cookie with expiration date in the past", () => {
    const mockThis = {} as SovendusThankyouPage;

    clearCookie.call(mockThis, "testParam" as keyof SovendusPageUrlParams);

    expect(document.cookie).toBe(
      "testParam=;secure;samesite=strict;expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=example.com;path=/",
    );
  });

  it("should use current hostname for domain", () => {
    Object.defineProperty(window, "location", {
      value: {
        hostname: "different.com",
      },
      writable: true,
    });

    const mockThis = {} as SovendusThankyouPage;

    clearCookie.call(mockThis, "testParam" as keyof SovendusPageUrlParams);

    expect(document.cookie).toBe(
      "testParam=;secure;samesite=strict;expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=different.com;path=/",
    );
  });
});
