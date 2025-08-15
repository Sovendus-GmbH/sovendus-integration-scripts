import {
  CountryCodes,
  LanguageCodes,
  type SovendusThankYouPageConfig,
} from "sovendus-integration-types";
import { describe, expect, it, vi } from "vitest";

import type { SovendusThankyouPage } from "../thankyou-page-handler";
import { getVoucherNetworkCountryBasedSettings } from "./get-voucher-network-country-based-settings";

describe("getVoucherNetworkCountryBasedSettings", () => {
  it("should return undefined when no country is set", () => {
    const mockThis = {
      detectLanguageCode: vi.fn(),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      customerData: { consumerCountry: undefined },
      settings: {},
    } as SovendusThankYouPageConfig;

    const result = getVoucherNetworkCountryBasedSettings.call(
      mockThis,
      mockConfig,
    );

    expect(result).toBeUndefined();
  });

  it("should return undefined when no country settings exist", () => {
    const mockThis = {
      detectLanguageCode: vi.fn(),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      customerData: { consumerCountry: CountryCodes.DE },
      settings: {
        voucherNetwork: {
          countries: {
            ids: {},
          },
        },
      },
    } as SovendusThankYouPageConfig;

    const result = getVoucherNetworkCountryBasedSettings.call(
      mockThis,
      mockConfig,
    );

    expect(result).toBeUndefined();
  });

  it("should return settings for single language country", () => {
    const mockThis = {
      detectLanguageCode: vi.fn(),
    } as unknown as SovendusThankyouPage;

    const languageSettings = {
      isEnabled: true,
      trafficSourceNumber: "123",
      trafficMediumNumber: "456",
    };

    const mockConfig = {
      customerData: { consumerCountry: CountryCodes.DE },
      settings: {
        voucherNetwork: {
          countries: {
            ids: {
              [CountryCodes.DE]: {
                languages: {
                  DE: languageSettings,
                },
              },
            },
          },
        },
      },
    } as SovendusThankYouPageConfig;

    const result = getVoucherNetworkCountryBasedSettings.call(
      mockThis,
      mockConfig,
    );

    expect(result).toEqual(languageSettings);
  });

  it("should return correct language for CH (multi-language) when consumerLanguage is provided", () => {
    const mockThis = {
      detectLanguageCode: vi.fn(),
    } as unknown as SovendusThankyouPage;

    const chDe = {
      isEnabled: true,
      trafficSourceNumber: "100",
      trafficMediumNumber: "200",
    };
    const chFr = {
      isEnabled: true,
      trafficSourceNumber: "101",
      trafficMediumNumber: "201",
    };
    const chIt = {
      isEnabled: false,
      trafficSourceNumber: "102",
      trafficMediumNumber: "202",
    };

    const mockConfig = {
      customerData: {
        consumerCountry: CountryCodes.CH,
        consumerLanguage: LanguageCodes.FR,
      },
      settings: {
        voucherNetwork: {
          countries: {
            ids: {
              [CountryCodes.CH]: {
                languages: {
                  DE: chDe,
                  FR: chFr,
                  IT: chIt,
                },
              },
            },
          },
        },
      },
    } as unknown as SovendusThankYouPageConfig;

    const result = getVoucherNetworkCountryBasedSettings.call(
      mockThis,
      mockConfig,
    );

    expect(result).toEqual({
      ...chFr,
      iframeContainerQuerySelector: undefined,
    });
  });

  it("should detect language for CH (multi-language) when consumerLanguage is missing", () => {
    const mockThis = {
      detectLanguageCode: vi.fn().mockReturnValue(LanguageCodes.IT),
    } as unknown as SovendusThankyouPage;

    const chDe = {
      isEnabled: true,
      trafficSourceNumber: "100",
      trafficMediumNumber: "200",
    };
    const chFr = {
      isEnabled: true,
      trafficSourceNumber: "101",
      trafficMediumNumber: "201",
    };
    const chIt = {
      isEnabled: true,
      trafficSourceNumber: "102",
      trafficMediumNumber: "202",
    };

    const mockConfig = {
      customerData: {
        consumerCountry: CountryCodes.CH,
        consumerLanguage: undefined,
      },
      settings: {
        voucherNetwork: {
          countries: {
            ids: {
              [CountryCodes.CH]: {
                languages: {
                  DE: chDe,
                  FR: chFr,
                  IT: chIt,
                },
              },
            },
          },
        },
      },
    } as unknown as SovendusThankYouPageConfig;

    const result = getVoucherNetworkCountryBasedSettings.call(
      mockThis,
      mockConfig,
    );

    expect(mockThis.detectLanguageCode).toHaveBeenCalled();
    expect(result).toEqual({
      ...chIt,
      iframeContainerQuerySelector: undefined,
    });
  });

  it("should return correct language for BE (multi-language) when consumerLanguage is provided", () => {
    const mockThis = {
      detectLanguageCode: vi.fn(),
    } as unknown as SovendusThankyouPage;

    const beNl = {
      isEnabled: true,
      trafficSourceNumber: "300",
      trafficMediumNumber: "400",
    };
    const beFr = {
      isEnabled: false,
      trafficSourceNumber: "301",
      trafficMediumNumber: "401",
    };
    // (BE has German as well, but many setups may only configure NL/FR)

    const mockConfig = {
      customerData: {
        consumerCountry: CountryCodes.BE,
        consumerLanguage: LanguageCodes.NL,
      },
      settings: {
        voucherNetwork: {
          countries: {
            ids: {
              [CountryCodes.BE]: {
                languages: {
                  NL: beNl,
                  FR: beFr,
                },
              },
            },
          },
        },
      },
    } as unknown as SovendusThankYouPageConfig;

    const result = getVoucherNetworkCountryBasedSettings.call(
      mockThis,
      mockConfig,
    );

    expect(result).toEqual({
      ...beNl,
      iframeContainerQuerySelector: undefined,
    });
  });

  it("should detect language for BE (multi-language) when consumerLanguage is missing", () => {
    const mockThis = {
      detectLanguageCode: vi.fn().mockReturnValue(LanguageCodes.FR),
    } as unknown as SovendusThankyouPage;

    const beNl = {
      isEnabled: true,
      trafficSourceNumber: "300",
      trafficMediumNumber: "400",
    };
    const beFr = {
      isEnabled: true,
      trafficSourceNumber: "301",
      trafficMediumNumber: "401",
    };

    const mockConfig = {
      customerData: {
        consumerCountry: CountryCodes.BE,
        consumerLanguage: undefined,
      },
      settings: {
        voucherNetwork: {
          countries: {
            ids: {
              [CountryCodes.BE]: {
                languages: {
                  NL: beNl,
                  FR: beFr,
                },
              },
            },
          },
        },
      },
    } as unknown as SovendusThankYouPageConfig;

    const result = getVoucherNetworkCountryBasedSettings.call(
      mockThis,
      mockConfig,
    );

    expect(mockThis.detectLanguageCode).toHaveBeenCalled();
    expect(result).toEqual({
      ...beFr,
      iframeContainerQuerySelector: undefined,
    });
  });
});
