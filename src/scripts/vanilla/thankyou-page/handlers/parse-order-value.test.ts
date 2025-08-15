import type { SovendusThankYouPageConfig } from "sovendus-integration-types";
import { describe, expect, it, vi } from "vitest";

import type { SovendusThankyouPage } from "../thankyou-page-handler";
import { parseOrderValue } from "./parse-order-value";

// Mock the shared-utils module
vi.mock("../../shared-utils", () => ({
  makeNumber: vi.fn(),
  loggerError: vi.fn(),
}));

describe("parseOrderValue", () => {
  it("should return early if no order value data", () => {
    const mockThis = {} as SovendusThankyouPage;
    const mockConfig = {
      orderData: { orderValue: undefined },
    } as unknown as SovendusThankYouPageConfig;

    parseOrderValue.call(mockThis, mockConfig);

    // Should not throw or modify anything
    expect(mockConfig.orderData.orderValue).toBeUndefined();
  });

  it("should use makeNumber on existing netOrderValue", async () => {
    const { makeNumber } = await import("../../shared-utils");
    vi.mocked(makeNumber).mockReturnValue(100.5);

    const mockThis = {} as SovendusThankyouPage;
    const mockConfig = {
      orderData: {
        orderValue: {
          netOrderValue: "100.50",
        },
      },
    } as SovendusThankYouPageConfig;

    parseOrderValue.call(mockThis, mockConfig);

    expect(makeNumber).toHaveBeenCalledWith("100.50");
    expect(mockConfig.orderData.orderValue?.netOrderValue).toBe(100.5);
  });

  it("should calculate net value from gross value", async () => {
    const { makeNumber } = await import("../../shared-utils");
    vi.mocked(makeNumber)
      .mockReturnValueOnce(120) // grossOrderValue
      .mockReturnValueOnce(10) // shippingValue
      .mockReturnValueOnce(20); // taxValue

    const mockThis = {} as SovendusThankyouPage;
    const mockConfig = {
      orderData: {
        orderValue: {
          netOrderValue: undefined,
          grossOrderValue: "120",
          shippingValue: "10",
          taxValue: "20",
        },
      },
    } as SovendusThankYouPageConfig;

    parseOrderValue.call(mockThis, mockConfig);

    expect(mockConfig.orderData.orderValue?.netOrderValue).toBe(90); // 120 - 20 - 10
  });

  it("should calculate net value using tax percent when tax value is undefined", async () => {
    const { makeNumber } = await import("../../shared-utils");
    vi.mocked(makeNumber)
      .mockReturnValueOnce(120) // grossOrderValue
      .mockReturnValueOnce(10) // shippingValue
      .mockReturnValueOnce(undefined) // taxValue (undefined)
      .mockReturnValueOnce(20); // taxPercent

    const mockThis = {} as SovendusThankyouPage;
    const mockConfig = {
      orderData: {
        orderValue: {
          netOrderValue: undefined,
          grossOrderValue: "120",
          shippingValue: "10",
          taxValue: undefined,
          taxPercent: "20",
        },
      },
    } as SovendusThankYouPageConfig;

    parseOrderValue.call(mockThis, mockConfig);

    // Tax calculation: (120 / (1 + 20/100)) * (20/100) = (120 / 1.2) * 0.2 = 100 * 0.2 = 20
    // Net value: 120 - 20 - 10 = 90
    expect(mockConfig.orderData.orderValue?.netOrderValue).toBe(90);
  });
});
