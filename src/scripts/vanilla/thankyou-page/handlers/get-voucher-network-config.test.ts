import {
  SettingsType,
  type SovendusThankYouPageConfig,
} from "sovendus-integration-types";
import { describe, expect, it, vi } from "vitest";

import type { SovendusThankyouPage } from "../thankyou-page-handler";
import { getVoucherNetworkConfig } from "./get-voucher-network-config";

describe("getVoucherNetworkConfig", () => {
  it("should return simple config when setting type is SIMPLE", () => {
    const mockThis = {
      getVoucherNetworkCountryBasedSettings: vi.fn(),
    } as unknown as SovendusThankyouPage;

    const simpleConfig = { isEnabled: true, trafficSourceNumber: "123" };
    const mockConfig = {
      settings: {
        voucherNetwork: {
          settingType: SettingsType.SIMPLE,
          simple: simpleConfig,
        },
      },
    } as SovendusThankYouPageConfig;

    const result = getVoucherNetworkConfig.call(mockThis, mockConfig);

    expect(result).toBe(simpleConfig);
    expect(
      mockThis.getVoucherNetworkCountryBasedSettings,
    ).not.toHaveBeenCalled();
  });

  it("should return country-based config when setting type is COUNTRY", () => {
    const countryConfig = { isEnabled: true, trafficSourceNumber: "456" };
    const mockThis = {
      getVoucherNetworkCountryBasedSettings: vi
        .fn()
        .mockReturnValue(countryConfig),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      settings: {
        voucherNetwork: {
          settingType: SettingsType.COUNTRY,
        },
      },
    } as SovendusThankYouPageConfig;

    const result = getVoucherNetworkConfig.call(mockThis, mockConfig);

    expect(result).toBe(countryConfig);
    expect(mockThis.getVoucherNetworkCountryBasedSettings).toHaveBeenCalledWith(
      mockConfig,
    );
  });

  it("should return undefined for unknown setting type", () => {
    const mockThis = {
      getVoucherNetworkCountryBasedSettings: vi.fn(),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      settings: {
        voucherNetwork: {
          settingType: "UNKNOWN",
        },
      },
    };

    const result = getVoucherNetworkConfig.call(
      mockThis,
      mockConfig as SovendusThankYouPageConfig,
    );

    expect(result).toBeUndefined();
    expect(
      mockThis.getVoucherNetworkCountryBasedSettings,
    ).not.toHaveBeenCalled();
  });

  it("should return undefined when no voucher network settings", () => {
    const mockThis = {
      getVoucherNetworkCountryBasedSettings: vi.fn(),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      settings: {},
    } as SovendusThankYouPageConfig;

    const result = getVoucherNetworkConfig.call(mockThis, mockConfig);

    expect(result).toBeUndefined();
  });
});
