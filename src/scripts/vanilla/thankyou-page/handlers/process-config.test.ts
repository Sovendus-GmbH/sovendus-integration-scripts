import type {
  IntegrationData,
  SovendusThankYouPageConfig,
} from "sovendus-integration-types";
import { describe, expect, it, vi } from "vitest";

import type { SovendusThankyouPage } from "../thankyou-page-handler";
import { processConfig } from "./process-config";

describe("processConfig", () => {
  it("should call all config processing methods in correct order", async () => {
    const mockThis = {
      parseVoucherCodes: vi.fn().mockResolvedValue(undefined),
      parseStreet: vi.fn(),
      handleCountryCode: vi.fn(),
      parseOrderValue: vi.fn(),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      customerData: {},
      orderData: {},
      settings: {},
    } as SovendusThankYouPageConfig;
    const mockStatus = { status: {}, data: {}, times: {} } as IntegrationData;

    await processConfig.call(mockThis, mockConfig, mockStatus);

    expect(mockThis.parseVoucherCodes).toHaveBeenCalledWith(
      mockConfig,
      mockStatus,
    );
    expect(mockThis.parseStreet).toHaveBeenCalledWith(mockConfig);
    expect(mockThis.handleCountryCode).toHaveBeenCalledWith(
      mockConfig,
      mockStatus,
    );
    expect(mockThis.parseOrderValue).toHaveBeenCalledWith(mockConfig);
  });
});
