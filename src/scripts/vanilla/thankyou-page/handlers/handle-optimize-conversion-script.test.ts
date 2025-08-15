import type {
  IntegrationData,
  SovendusThankYouPageConfig,
} from "sovendus-integration-types";
import { describe, expect, it, vi } from "vitest";

import type { SovendusThankyouPage } from "../thankyou-page-handler";
import { handleOptimizeConversionScript } from "./handle-optimize-conversion-script";

// Mock document
const mockCreateElement = vi.fn(() => ({
  type: "",
  async: false,
  src: "",
}));

const mockAppendChild = vi.fn();

Object.defineProperty(document, "createElement", {
  value: mockCreateElement,
  writable: true,
});

Object.defineProperty(document, "head", {
  value: {
    appendChild: mockAppendChild,
  },
  writable: true,
});

describe("handleOptimizeConversionScript", () => {
  it("should create and append optimize conversion script", async () => {
    const mockScript = {
      type: "",
      async: false,
      src: "",
    } as HTMLScriptElement;

    mockCreateElement.mockReturnValue(mockScript);

    const mockThis = {} as SovendusThankyouPage;
    const mockConfig = {
      orderData: {
        orderValue: { netOrderValue: 100 },
        orderId: "12345",
      },
      customerData: {
        consumerEmail: "test@example.com",
      },
    } as SovendusThankYouPageConfig;
    const mockStatus = {
      status: { loadedOptimize: false },
    } as IntegrationData;

    await handleOptimizeConversionScript.call(
      mockThis,
      "optimize123",
      "COUPON123",
      mockConfig,
      mockStatus,
    );

    expect(mockCreateElement).toHaveBeenCalledWith("script");
    expect(mockScript.type).toBe("text/javascript");
    expect(mockScript.async).toBe(true);
    expect(mockScript.src).toBe(
      "https://www.sovopt.com/optimize123/conversion/?ordervalue=100&ordernumber=12345&vouchercode=COUPON123&email=test@example.com",
    );
    expect(mockAppendChild).toHaveBeenCalledWith(mockScript);
    expect(mockStatus.status.loadedOptimize).toBe(true);
  });

  it("should handle undefined coupon code", async () => {
    const mockScript = {
      type: "",
      async: false,
      src: "",
    } as HTMLScriptElement;

    mockCreateElement.mockReturnValue(mockScript);

    const mockThis = {} as SovendusThankyouPage;
    const mockConfig = {
      orderData: {
        orderValue: { netOrderValue: 100 },
        orderId: "12345",
      },
      customerData: {
        consumerEmail: "test@example.com",
      },
    } as SovendusThankYouPageConfig;
    const mockStatus = {
      status: { loadedOptimize: false },
    } as IntegrationData;

    await handleOptimizeConversionScript.call(
      mockThis,
      "optimize123",
      undefined,
      mockConfig,
      mockStatus,
    );

    expect(mockScript.src).toBe(
      "https://www.sovopt.com/optimize123/conversion/?ordervalue=100&ordernumber=12345&vouchercode=undefined&email=test@example.com",
    );
  });
});
