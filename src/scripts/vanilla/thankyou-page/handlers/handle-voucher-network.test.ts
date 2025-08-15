import type {
  IntegrationData,
  SovendusThankYouPageConfig,
} from "sovendus-integration-types";
import { describe, expect, it, vi } from "vitest";

import type { SovendusThankyouPage } from "../thankyou-page-handler";
import { handleVoucherNetwork } from "./handle-voucher-network";

// Mock the shared-utils module
vi.mock("../../shared-utils", () => ({
  throwErrorInNonBrowserContext: vi.fn(),
}));

// Mock constants
vi.mock("./constants", () => ({
  flexibleIframeScriptId: "sovendus-iframe-script",
}));

// Mock document and window
const mockCreateElement = vi.fn(() => ({
  type: "",
  async: false,
  id: "",
  src: "",
}));

Object.defineProperty(document, "createElement", {
  value: mockCreateElement,
  writable: true,
});

Object.defineProperty(document, "head", {
  value: {
    appendChild: vi.fn(),
  },
  writable: true,
});

Object.defineProperty(window, "sovIframes", {
  value: [],
  writable: true,
});

Object.defineProperty(window, "sovConsumer", {
  value: {},
  writable: true,
});

describe("handleVoucherNetwork", () => {
  it("should handle voucher network when enabled", async () => {
    const mockThis = {
      getVoucherNetworkConfig: vi.fn().mockReturnValue({
        trafficSourceNumber: "123",
        trafficMediumNumber: "456",
        isEnabled: true,
      }),
      handleSovendusVoucherNetworkDivContainer: vi
        .fn()
        .mockReturnValue("container-id"),
      getPerformanceTime: vi.fn().mockReturnValue(123.456),
      sendCouponCodes: vi.fn().mockResolvedValue(undefined),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      orderData: {
        sessionId: "session123",
        orderId: "order123",
        orderValue: { netOrderValue: 100 },
        orderCurrency: "EUR",
        usedCouponCodes: ["COUPON1", "COUPON2"],
      },
      customerData: {
        consumerFirstName: "John",
        consumerLastName: "Doe",
        consumerEmail: "john@example.com",
      },
      integrationType: "test",
    } as SovendusThankYouPageConfig;

    const mockStatus = {
      status: {
        integrationLoaderVnCbStarted: false,
      },
      times: {},
    } as IntegrationData;

    const mockScript = {
      type: "",
      async: false,
      id: "",
      src: "",
    };

    mockCreateElement.mockReturnValue(mockScript as HTMLScriptElement);

    await handleVoucherNetwork.call(mockThis, mockConfig, mockStatus);

    expect(mockThis.getVoucherNetworkConfig).toHaveBeenCalledWith(mockConfig);
    expect(
      mockThis.handleSovendusVoucherNetworkDivContainer,
    ).toHaveBeenCalled();
    expect(mockCreateElement).toHaveBeenCalledWith("script");
    expect(mockScript.src).toBe(
      "https://api.sovendus.com/sovabo/common/js/flexibleIframe.js",
    );
    expect(mockThis.sendCouponCodes).toHaveBeenCalledWith(
      mockConfig.orderData,
      "123",
      mockStatus,
      true,
    );
    expect(mockStatus.status.integrationLoaderVnCbStarted).toBe(true);
  });

  it("should not handle voucher network when disabled", async () => {
    const mockThis = {
      getVoucherNetworkConfig: vi.fn().mockReturnValue({
        trafficSourceNumber: "123",
        trafficMediumNumber: "456",
        isEnabled: false,
      }),
      handleSovendusVoucherNetworkDivContainer: vi.fn(),
      getPerformanceTime: vi.fn(),
      sendCouponCodes: vi.fn(),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {} as SovendusThankYouPageConfig;
    const mockStatus = {} as IntegrationData;

    await handleVoucherNetwork.call(mockThis, mockConfig, mockStatus);

    expect(
      mockThis.handleSovendusVoucherNetworkDivContainer,
    ).not.toHaveBeenCalled();
    expect(mockThis.sendCouponCodes).not.toHaveBeenCalled();
  });
});
