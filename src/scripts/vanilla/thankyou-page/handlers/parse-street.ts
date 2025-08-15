import type { SovendusThankYouPageConfig } from "sovendus-integration-types";

import type { SovendusThankyouPage } from "../thankyou-page-handler";

export function parseStreet(
  this: SovendusThankyouPage,
  sovThankyouConfig: SovendusThankYouPageConfig,
): void {
  if (sovThankyouConfig.customerData.consumerStreetWithNumber) {
    const [street, streetNumber] = this.splitStreetAndStreetNumber(
      sovThankyouConfig.customerData.consumerStreetWithNumber,
    );
    sovThankyouConfig.customerData.consumerStreet = street;
    sovThankyouConfig.customerData.consumerStreetNumber = streetNumber;
  }
}
