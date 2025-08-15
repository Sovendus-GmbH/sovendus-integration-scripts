import type {
  IntegrationData,
  SovendusConversionsData,
} from "sovendus-integration-types";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SovendusThankyouPage } from "../thankyou-page-handler";
import { couponRedemptionApi, sendCouponCodes } from "./send-coupon-codes";

// Mock fetch globally
global.fetch = vi.fn();

describe("sendCouponCodes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should send all coupon codes when skipFirstCouponCode is false", async () => {
    const mockThis = {} as SovendusThankyouPage;
    const orderData = {
      usedCouponCodes: ["CODE1", "CODE2", "CODE3"],
      orderValue: { netOrderValue: 100 },
      orderCurrency: "EUR",
      orderId: "12345",
      sessionId: "session123",
    } as SovendusConversionsData;

    vi.mocked(fetch).mockResolvedValue(new Response());

    const mockStatus = { status: {} } as IntegrationData;

    await sendCouponCodes.call(
      mockThis,
      orderData,
      "traffic123",
      mockStatus,
      false,
    );

    expect(fetch).toHaveBeenCalledTimes(3);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(couponRedemptionApi),
      {
        method: "POST",
        body: expect.stringContaining("CODE1"),
      },
    );
  });

  it("should skip first coupon code when skipFirstCouponCode is true", async () => {
    const mockThis = {} as SovendusThankyouPage;
    const orderData = {
      usedCouponCodes: ["CODE1", "CODE2", "CODE3"],
      orderValue: { netOrderValue: 100 },
      orderCurrency: "EUR",
      orderId: "12345",
      sessionId: "session123",
    } as SovendusConversionsData;

    vi.mocked(fetch).mockResolvedValue(new Response());

    const mockStatus = { status: {} } as IntegrationData;

    await sendCouponCodes.call(
      mockThis,
      orderData,
      "traffic123",
      mockStatus,
      true,
    );

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        body: expect.stringContaining("CODE1"),
      }),
    );
  });

  it("should handle empty coupon codes array", async () => {
    const mockThis = {} as SovendusThankyouPage;
    const orderData = {
      usedCouponCodes: [],
      orderValue: { netOrderValue: 100 },
      orderCurrency: "EUR",
      orderId: "12345",
      sessionId: "session123",
    } as SovendusConversionsData;

    const mockStatus = { status: {} } as IntegrationData;

    await sendCouponCodes.call(
      mockThis,
      orderData,
      "traffic123",
      mockStatus,
      false,
    );

    expect(fetch).not.toHaveBeenCalled();
  });
});
