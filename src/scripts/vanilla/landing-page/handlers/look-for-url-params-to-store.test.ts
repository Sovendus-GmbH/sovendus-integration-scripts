import type {
  SovendusPageUrlParams,
  SovPageStatus,
} from "sovendus-integration-types";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SovendusPage } from "../sovendus-page-handler";
import { lookForUrlParamsToStore } from "./look-for-url-params-to-store";

// Mock document.cookie setter
Object.defineProperty(document, "cookie", {
  set: vi.fn(),
});

describe("lookForUrlParamsToStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should set cookies for provided params and update status", async () => {
    const params: SovendusPageUrlParams = {
      sovCouponCode: "ABC123",
      sovReqToken: "XYZ",
      puid: undefined,
      sovDebugLevel: undefined,
    };

    const mockThis = {
      getSovendusUrlParameters: vi.fn().mockResolvedValue(params),
      setCookie: vi.fn(),
    } as unknown as SovendusPage;

    const status = {
      status: { storedCookies: false },
    } as unknown as SovPageStatus;

    const result = await lookForUrlParamsToStore.call(mockThis, status);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockThis.setCookie).toHaveBeenCalledTimes(2);
    expect(status.status.storedCookies).toBe(true);
    expect(result).toEqual(params);
  });

  it("should handle errors and return defaults", async () => {
    const mockThis = {
      getSovendusUrlParameters: vi.fn().mockRejectedValue(new Error("fail")),
      setCookie: vi.fn(),
    } as unknown as SovendusPage;

    const status = {
      status: { storedCookies: true },
    } as unknown as SovPageStatus;

    const result = await lookForUrlParamsToStore.call(mockThis, status);

    expect(result).toEqual({
      sovCouponCode: undefined,
      sovReqToken: undefined,
      puid: undefined,
      sovDebugLevel: undefined,
    });
  });
});
