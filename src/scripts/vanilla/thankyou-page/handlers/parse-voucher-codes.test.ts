import type {
  IntegrationData,
  SovendusThankYouPageConfig,
} from "sovendus-integration-types";
import { describe, expect, it, vi } from "vitest";

import type { SovendusThankyouPage } from "../thankyou-page-handler";
import { parseVoucherCodes } from "./parse-voucher-codes";

describe("parseVoucherCodes", () => {
  it("should use cookie coupon code if available", async () => {
    const mockThis = {
      getCookie: vi.fn().mockResolvedValue("COOKIE123"),
      clearCookie: vi.fn(),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      orderData: {
        usedCouponCodes: ["EXISTING123"],
        usedCouponCode: "SINGLE123",
      },
    } as SovendusThankYouPageConfig;
    const mockStatus = {
      status: { voucherNetworkCookieBasedVoucherFound: false },
    } as IntegrationData;

    await parseVoucherCodes.call(mockThis, mockConfig, mockStatus);

    expect(mockThis.getCookie).toHaveBeenCalledWith("sovCouponCode");
    expect(mockThis.clearCookie).toHaveBeenCalledWith("sovCouponCode");
    expect(mockConfig.orderData.usedCouponCodes).toEqual(["COOKIE123"]);
  });

  it("should combine existing coupon codes", async () => {
    const mockThis = {
      getCookie: vi.fn().mockResolvedValue(undefined),
      clearCookie: vi.fn(),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      orderData: {
        usedCouponCodes: ["EXISTING123"],
        usedCouponCode: "SINGLE123",
      },
    } as SovendusThankYouPageConfig;
    const mockStatus = {
      status: { voucherNetworkCookieBasedVoucherFound: false },
    } as IntegrationData;

    await parseVoucherCodes.call(mockThis, mockConfig, mockStatus);

    expect(mockThis.clearCookie).not.toHaveBeenCalled();
    expect(mockConfig.orderData.usedCouponCodes).toEqual([
      "EXISTING123",
      "SINGLE123",
    ]);
  });

  it("should handle no coupon codes", async () => {
    const mockThis = {
      getCookie: vi.fn().mockResolvedValue(undefined),
      clearCookie: vi.fn(),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      orderData: {
        usedCouponCodes: [],
        usedCouponCode: undefined,
      },
    } as unknown as SovendusThankYouPageConfig;
    const mockStatus = {
      status: { voucherNetworkCookieBasedVoucherFound: false },
    } as IntegrationData;

    await parseVoucherCodes.call(mockThis, mockConfig, mockStatus);

    expect(mockConfig.orderData.usedCouponCodes).toEqual([]);
  });
});
