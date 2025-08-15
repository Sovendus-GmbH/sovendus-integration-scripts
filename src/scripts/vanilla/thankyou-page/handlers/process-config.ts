import type {
  IntegrationData,
  LanguageCodes,
  SovendusThankYouPageConfig,
} from "sovendus-integration-types";

import type { SovendusThankyouPage } from "../thankyou-page-handler";

export async function processConfig(
  this: SovendusThankyouPage,
  sovThankyouConfig: SovendusThankYouPageConfig,
  sovThankyouStatus: IntegrationData,
): Promise<void> {
  await this.parseVoucherCodes(sovThankyouConfig, sovThankyouStatus);
  this.parseStreet(sovThankyouConfig);
  this.handleCountryCode(sovThankyouConfig, sovThankyouStatus);
  this.parseOrderValue(sovThankyouConfig);
  // just in case
  sovThankyouConfig.customerData.consumerLanguage =
    sovThankyouConfig.customerData.consumerLanguage?.toUpperCase() as
      | LanguageCodes
      | undefined;
}
