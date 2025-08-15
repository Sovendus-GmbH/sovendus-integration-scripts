import {
  CountryCodes,
  type IntegrationData,
  type SovendusThankYouPageConfig,
} from "sovendus-integration-types";
import { describe, expect, it, vi } from "vitest";

import type { SovendusThankyouPage } from "../thankyou-page-handler";
import { handleCountryCode } from "./handle-country-code";

describe("handleCountryCode", () => {
  it("should convert UK to GB", () => {
    const mockThis = {
      detectCountryCode: vi.fn().mockReturnValue(CountryCodes.DE),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      customerData: { consumerCountry: "UK" },
    } as SovendusThankYouPageConfig;
    const mockStatus = {
      status: { countryCodePassedOnByPlugin: false },
    } as IntegrationData;

    handleCountryCode.call(mockThis, mockConfig, mockStatus);

    expect(mockConfig.customerData.consumerCountry).toBe(CountryCodes.GB);
    expect(mockStatus.status.countryCodePassedOnByPlugin).toBe(true);
  });

  it("should detect country code when not provided", () => {
    const mockThis = {
      detectCountryCode: vi.fn().mockReturnValue(CountryCodes.DE),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      customerData: { consumerCountry: undefined },
    } as SovendusThankYouPageConfig;
    const mockStatus = {
      status: { countryCodePassedOnByPlugin: false },
    } as IntegrationData;

    handleCountryCode.call(mockThis, mockConfig, mockStatus);

    expect(mockThis.detectCountryCode).toHaveBeenCalled();
    expect(mockStatus.status.countryCodePassedOnByPlugin).toBe(false);
  });

  it("should keep existing country code", () => {
    const mockThis = {
      detectCountryCode: vi.fn(),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      customerData: { consumerCountry: CountryCodes.DE },
    } as SovendusThankYouPageConfig;
    const mockStatus = {
      status: { countryCodePassedOnByPlugin: false },
    } as IntegrationData;

    handleCountryCode.call(mockThis, mockConfig, mockStatus);

    expect(mockThis.detectCountryCode).not.toHaveBeenCalled();
    expect(mockStatus.status.countryCodePassedOnByPlugin).toBe(true);
  });
});
