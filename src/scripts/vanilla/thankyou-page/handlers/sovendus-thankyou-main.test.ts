import type { SovendusThankYouPageConfig } from "sovendus-integration-types";
import { describe, expect, it, vi } from "vitest";

import type { SovendusThankyouPage } from "../thankyou-page-handler";
import { sovendusThankyouMain } from "./sovendus-thankyou-main";

describe("sovendusThankyouMain", () => {
  it("should handle undefined config", async () => {
    const mockThis = {
      initializeStatus: vi.fn().mockReturnValue({
        status: { sovThankyouConfigFound: false },
        times: {},
      }),
      processConfig: vi.fn(),
      handleVoucherNetwork: vi.fn(),
      handleOptimizeConversion: vi.fn(),
      handleCheckoutProductsConversion: vi.fn(),
      getPerformanceTime: vi.fn().mockReturnValue(123),
    } as unknown as SovendusThankyouPage;

    const onDone = vi.fn();

    await sovendusThankyouMain.call(
      mockThis,
      undefined as unknown as SovendusThankYouPageConfig,
      onDone,
    );

    expect(mockThis.initializeStatus).toHaveBeenCalled();
    expect(onDone).toHaveBeenCalledWith({
      sovThankyouStatus: expect.objectContaining({
        status: { sovThankyouConfigFound: false },
      }),
      sovThankyouConfig: undefined,
    });
  });

  it("should process valid config", async () => {
    const mockThis = {
      initializeStatus: vi.fn().mockReturnValue({
        status: { sovThankyouConfigFound: true },
        times: {},
      }),
      processConfig: vi.fn().mockResolvedValue(undefined),
      handleVoucherNetwork: vi.fn().mockResolvedValue(undefined),
      handleOptimizeConversion: vi.fn().mockResolvedValue(undefined),
      handleCheckoutProductsConversion: vi.fn().mockResolvedValue(undefined),
      getPerformanceTime: vi.fn().mockReturnValue(123),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      customerData: {},
      orderData: {},
      settings: {},
    } as unknown as SovendusThankYouPageConfig;
    const onDone = vi.fn();

    await sovendusThankyouMain.call(mockThis, mockConfig, onDone);

    expect(mockThis.processConfig).toHaveBeenCalledWith(
      mockConfig,
      expect.any(Object),
    );
    expect(mockThis.handleVoucherNetwork).toHaveBeenCalled();
    expect(mockThis.handleOptimizeConversion).toHaveBeenCalled();
    expect(mockThis.handleCheckoutProductsConversion).toHaveBeenCalled();
    expect(onDone).toHaveBeenCalled();
  });
});
