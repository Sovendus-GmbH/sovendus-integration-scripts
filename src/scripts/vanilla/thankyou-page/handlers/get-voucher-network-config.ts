import {
  SettingsType,
  type SovendusThankYouPageConfig,
  type VoucherNetworkLanguage,
} from "sovendus-integration-types";

import type { SovendusThankyouPage } from "../thankyou-page-handler";

export function getVoucherNetworkConfig(
  this: SovendusThankyouPage,
  sovThankyouConfig: SovendusThankYouPageConfig,
): VoucherNetworkLanguage | undefined {
  if (
    sovThankyouConfig.settings?.voucherNetwork?.settingType ===
    SettingsType.SIMPLE
  ) {
    return sovThankyouConfig.settings?.voucherNetwork?.simple;
  }
  if (
    sovThankyouConfig.settings?.voucherNetwork?.settingType ===
    SettingsType.COUNTRY
  ) {
    return this.getVoucherNetworkCountryBasedSettings(sovThankyouConfig);
  }
  return undefined;
}
