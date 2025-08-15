import {
  CountryCodes,
  type IntegrationData,
  type SovendusThankYouPageConfig,
} from "sovendus-integration-types";

import type { SovendusThankyouPage } from "../thankyou-page-handler";

export function handleCountryCode(
  this: SovendusThankyouPage,
  sovThankyouConfig: SovendusThankYouPageConfig,
  sovThankyouStatus: IntegrationData,
): void {
  // using string literal "UK" intentionally despite type mismatch as some systems might return UK instead of GB
  if (sovThankyouConfig.customerData.consumerCountry === "UK") {
    sovThankyouConfig.customerData.consumerCountry = CountryCodes.GB;
  }
  if (!sovThankyouConfig.customerData.consumerCountry) {
    sovThankyouStatus.status.countryCodePassedOnByPlugin = false;
    sovThankyouConfig.customerData.consumerCountry =
      sovThankyouConfig.customerData.consumerCountry ||
      this.detectCountryCode();
  } else {
    sovThankyouStatus.status.countryCodePassedOnByPlugin = true;
  }
}
