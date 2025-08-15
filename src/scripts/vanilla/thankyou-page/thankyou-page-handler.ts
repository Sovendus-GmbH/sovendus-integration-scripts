import type {
  CountryCodes,
  IframeContainerQuerySelectorSettings,
  IntegrationData,
  LanguageCodes,
  SovendusConversionsData,
  SovendusPageUrlParams,
  SovendusThankYouPageConfig,
  SovendusThankyouPageData,
  VoucherNetworkLanguage,
} from "sovendus-integration-types";

import { detectCountryCode, getPerformanceTime } from "../shared-utils";
import {
  clearCookie,
  detectLanguageCode,
  getCookie,
  handleOptimizeConversionScript,
  handleSovendusVoucherNetworkDivContainer,
  handleVoucherNetwork,
  parseVoucherCodes,
  sendCouponCodes,
} from "./handlers";
import {
  getVoucherNetworkConfig,
  getVoucherNetworkCountryBasedSettings,
  handleCheckoutProductsConversion,
  handleCountryCode,
  handleOptimizeConversion,
  initializeStatus,
  parseOrderValue,
  parseStreet,
  processConfig,
  sovendusThankyouMain,
  splitStreetAndStreetNumber,
} from "./handlers";
import { getIframeQuerySelector } from "./handlers/handle-sovendus-voucher-network-div-container";
import { unmountThankYou } from "./handlers/unmount";

export class SovendusThankyouPage {
  // Standard implementation of the Sovendus thankyou page script
  // You can extend/implement this class and override the methods to customize the behavior
  // You can find example overrides in our Shopify app, other plugins use it as is
  // Also make sure to check out our docs for more information

  main: (
    sovThankyouConfig: SovendusThankYouPageConfig,
    onDone: ({
      sovThankyouConfig,
      sovThankyouStatus,
    }: SovendusThankyouPageData) => void,
  ) => Promise<void> = sovendusThankyouMain;

  processConfig: (
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ) => Promise<void> = processConfig;

  handleCountryCode: (
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ) => void = handleCountryCode;

  handleOptimizeConversion: (
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ) => Promise<void> = handleOptimizeConversion;

  handleOptimizeConversionScript: (
    optimizeId: string,
    couponCode: string | undefined,
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ) => Promise<void> | void = handleOptimizeConversionScript;

  parseStreet: (sovThankyouConfig: SovendusThankYouPageConfig) => void =
    parseStreet;

  splitStreetAndStreetNumber: (street: string) => [string, string] =
    splitStreetAndStreetNumber;

  parseVoucherCodes: (
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ) => Promise<void> = parseVoucherCodes;

  sendCouponCodes: (
    orderData: SovendusConversionsData,
    trafficSourceNumber: string,
    sovThankyouStatus: IntegrationData,
    skipFirstCouponCode: boolean,
  ) => Promise<void> = sendCouponCodes;

  initializeStatus: () => IntegrationData = initializeStatus;

  handleVoucherNetwork: (
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ) => void = handleVoucherNetwork;

  parseOrderValue: (sovThankyouConfig: SovendusThankYouPageConfig) => void =
    parseOrderValue;

  handleSovendusVoucherNetworkDivContainer: (
    voucherNetworkConfig: VoucherNetworkLanguage,
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ) => string = handleSovendusVoucherNetworkDivContainer;

  getIframeQuerySelector: (
    voucherNetworkConfig: VoucherNetworkLanguage,
    sovThankyouConfig: SovendusThankYouPageConfig,
  ) => IframeContainerQuerySelectorSettings = getIframeQuerySelector;

  handleCheckoutProductsConversion: (
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ) => Promise<boolean> = handleCheckoutProductsConversion;

  getCookie: (
    name: keyof SovendusPageUrlParams,
  ) => Promise<string | undefined> | string | undefined = getCookie;

  clearCookie: (name: keyof SovendusPageUrlParams) => void = clearCookie;

  getVoucherNetworkConfig: (
    sovThankyouConfig: SovendusThankYouPageConfig,
  ) => VoucherNetworkLanguage | undefined = getVoucherNetworkConfig;

  getVoucherNetworkCountryBasedSettings: (
    sovThankyouConfig: SovendusThankYouPageConfig,
  ) => VoucherNetworkLanguage | undefined =
    getVoucherNetworkCountryBasedSettings;

  detectLanguageCode: (country: CountryCodes) => LanguageCodes | undefined =
    detectLanguageCode;

  getPerformanceTime: () => number = getPerformanceTime;

  detectCountryCode: () => CountryCodes | undefined = detectCountryCode;

  unmount: () => void = unmountThankYou;
}
