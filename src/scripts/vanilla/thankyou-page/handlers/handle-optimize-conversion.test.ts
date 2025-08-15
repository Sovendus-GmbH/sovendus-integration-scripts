import type {
  IntegrationData,
  SovendusThankYouPageConfig,
} from "sovendus-integration-types";
import { describe, expect, it, vi } from "vitest";

import { getOptimizeId } from "../../shared-utils";
import type { SovendusThankyouPage } from "../thankyou-page-handler";
import { handleOptimizeConversion } from "./handle-optimize-conversion";

// Mock the shared-utils module
vi.mock("../../shared-utils", () => ({
  getOptimizeId: vi.fn(),
}));

describe("handleOptimizeConversion", () => {
  it("should return early if no optimize ID", async () => {
    vi.mocked(getOptimizeId).mockReturnValue(undefined);

    const mockThis = {
      handleOptimizeConversionScript: vi.fn(),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      settings: {},
      customerData: { consumerCountry: "DE" },
      orderData: { usedCouponCodes: ["TEST123"] },
    } as SovendusThankYouPageConfig;
    const mockStatus = {} as IntegrationData;

    await handleOptimizeConversion.call(mockThis, mockConfig, mockStatus);

    expect(mockThis.handleOptimizeConversionScript).not.toHaveBeenCalled();
  });

  it("should call handleOptimizeConversionScript with optimize ID", async () => {
    vi.mocked(getOptimizeId).mockReturnValue("test-optimize-id");

    const mockThis = {
      handleOptimizeConversionScript: vi.fn().mockResolvedValue(undefined),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      settings: {},
      customerData: { consumerCountry: "DE" },
      orderData: { usedCouponCodes: ["TEST123"] },
    } as SovendusThankYouPageConfig;
    const mockStatus = {} as IntegrationData;

    await handleOptimizeConversion.call(mockThis, mockConfig, mockStatus);

    expect(mockThis.handleOptimizeConversionScript).toHaveBeenCalledWith(
      "test-optimize-id",
      "TEST123",
      mockConfig,
      mockStatus,
    );
  });
});
