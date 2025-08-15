import type { SovendusPageUrlParams } from "sovendus-integration-types";
import { describe, expect, it } from "vitest";

import type { SovendusThankyouPage } from "../thankyou-page-handler";
import { getCookie } from "./get-cookie";

// Mock document.cookie
Object.defineProperty(document, "cookie", {
  writable: true,
  value: "",
});

describe("getCookie", () => {
  it("should return cookie value when cookie exists", () => {
    document.cookie = "testParam=testValue; otherCookie=otherValue";

    const result = getCookie.call(
      {} as SovendusThankyouPage,
      "testParam" as keyof SovendusPageUrlParams,
    );

    expect(result).toBe("testValue");
  });

  it("should return undefined when cookie does not exist", () => {
    document.cookie = "otherCookie=otherValue";

    const result = getCookie.call(
      {} as SovendusThankyouPage,
      "testParam" as keyof SovendusPageUrlParams,
    );

    expect(result).toBeUndefined();
  });

  it("should handle empty cookie string", () => {
    document.cookie = "";

    const result = getCookie.call(
      {} as SovendusThankyouPage,
      "testParam" as keyof SovendusPageUrlParams,
    );

    expect(result).toBeUndefined();
  });

  it("should handle cookie with semicolon in value", () => {
    document.cookie = "testParam=value;with;semicolons; otherCookie=other";

    const result = getCookie.call(
      {} as SovendusThankyouPage,
      "testParam" as keyof SovendusPageUrlParams,
    );

    expect(result).toBe("value");
  });
});
