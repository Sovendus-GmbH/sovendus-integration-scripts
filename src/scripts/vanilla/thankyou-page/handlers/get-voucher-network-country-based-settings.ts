import type {
  CountryCodes,
  LanguageCodes,
  VoucherNetworkLanguage,
} from "sovendus-integration-types";
import {
  LANGUAGES_BY_COUNTRIES,
  type SovendusThankYouPageConfig,
} from "sovendus-integration-types";

import type { SovendusThankyouPage } from "../thankyou-page-handler";

export function getVoucherNetworkCountryBasedSettings(
  this: SovendusThankyouPage,
  sovThankyouConfig: SovendusThankYouPageConfig,
): VoucherNetworkLanguage | undefined {
  const country = sovThankyouConfig.customerData
    .consumerCountry as CountryCodes;
  if (!sovThankyouConfig.customerData.consumerCountry) {
    return undefined;
  }
  const countrySettings =
    sovThankyouConfig.settings?.voucherNetwork?.countries?.ids?.[country];
  const languagesSettings = countrySettings?.languages;
  if (!languagesSettings) {
    return undefined;
  }
  const languagesAvailable = Object.keys(LANGUAGES_BY_COUNTRIES[country]);
  if (languagesAvailable?.length === 1) {
    // if there is only one language available, we use that one
    const language = languagesAvailable[0] as LanguageCodes;
    const languageSettings = languagesSettings[language];
    return {
      isEnabled: languageSettings?.isEnabled || false,
      trafficSourceNumber: languageSettings?.trafficSourceNumber || "",
      trafficMediumNumber: languageSettings?.trafficMediumNumber || "",
      ...languageSettings,
      iframeContainerQuerySelector:
        sovThankyouConfig.settings?.voucherNetwork?.countries
          ?.iframeContainerQuerySelector ||
        languageSettings?.iframeContainerQuerySelector,
    };
  }
  if (languagesAvailable?.length > 1) {
    // if there are multiple languages available, we use the one passed on by the plugin or detected
    const languageKey =
      sovThankyouConfig.customerData.consumerLanguage ||
      this.detectLanguageCode(country);
    const languageSettings = languageKey && languagesSettings[languageKey];
    if (!languageSettings) {
      return undefined;
    }
    return {
      ...languageSettings,
      iframeContainerQuerySelector:
        sovThankyouConfig.settings.voucherNetwork?.countries
          ?.iframeContainerQuerySelector ||
        languageSettings?.iframeContainerQuerySelector,
    };
  }
  return undefined;
}
