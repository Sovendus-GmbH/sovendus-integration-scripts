import type {
  LanguageCodes,
  OrderValueData,
  SovendusThankyouPageData,
  VoucherNetworkLanguage,
} from "sovendus-integration-types";
import {
  CountryCodes,
  type IntegrationData,
  LANGUAGES_BY_COUNTRIES,
  type SovendusThankYouPageConfig,
} from "sovendus-integration-types";

import { integrationScriptVersion } from "../constants";
import { getOptimizeId, loggerError, makeNumber } from "../shared-utils";
import type { SovendusThankyouPage } from "./thankyou-page-handler";

export async function sovendusThankyouMain(
  this: SovendusThankyouPage,
  sovThankyouConfig: SovendusThankYouPageConfig,
  onDone: ({
    sovThankyouConfig,
    sovThankyouStatus,
  }: SovendusThankyouPageData) => void,
): Promise<void> {
  const sovThankyouStatus = this.initializeStatus();
  try {
    if (!sovThankyouConfig) {
      sovThankyouStatus.status.sovThankyouConfigFound = false;
      loggerError("sovThankyouConfig is not defined", "ThankyouPage");
      onDone({ sovThankyouStatus, sovThankyouConfig });
      return;
    }
    sovThankyouStatus.status.sovThankyouConfigFound = true;
    await this.processConfig(sovThankyouConfig, sovThankyouStatus);

    this.handleVoucherNetwork(sovThankyouConfig, sovThankyouStatus);
    await this.handleCheckoutProductsConversion(
      sovThankyouConfig,
      sovThankyouStatus,
    );
    await this.handleOptimizeConversion(sovThankyouConfig, sovThankyouStatus);
    sovThankyouStatus.times.integrationLoaderDone = this.getPerformanceTime();
    sovThankyouStatus.status.integrationLoaderDone = true;
  } catch (error) {
    loggerError("Error in SovendusThankyouPage.main", "ThankyouPage", error);
  }
  onDone({ sovThankyouConfig, sovThankyouStatus });
}

export async function processConfig(
  this: SovendusThankyouPage,
  sovThankyouConfig: SovendusThankYouPageConfig,
  sovThankyouStatus: IntegrationData,
): Promise<void> {
  await this.handleVoucherCode(sovThankyouConfig);
  this.handleStreet(sovThankyouConfig);
  this.handleCountryCode(sovThankyouConfig, sovThankyouStatus);
  this.handleOrderValue(sovThankyouConfig);
}

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

export async function handleOptimizeConversion(
  this: SovendusThankyouPage,
  sovThankyouConfig: SovendusThankYouPageConfig,
  sovThankyouStatus: IntegrationData,
): Promise<void> {
  const optimizeId = getOptimizeId(
    sovThankyouConfig.settings,
    sovThankyouConfig.customerData.consumerCountry,
  );
  if (!optimizeId) {
    return;
  }
  // TODO handle multiple coupon codes
  const couponCode = sovThankyouConfig.orderData.usedCouponCodes?.[0];
  await this.handleOptimizeConversionScript(
    optimizeId,
    couponCode,
    sovThankyouConfig,
    sovThankyouStatus,
  );
}

export function handleStreet(
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

export function handleOrderValue(
  this: SovendusThankyouPage,
  sovThankyouConfig: SovendusThankYouPageConfig,
): void {
  const orderValueData = sovThankyouConfig.orderData.orderValue;
  if (!orderValueData) {
    return;
  }
  if (orderValueData.netOrderValue) {
    orderValueData.netOrderValue = makeNumber(orderValueData.netOrderValue);
  } else {
    orderValueData.netOrderValue = calculateNetValue(orderValueData);
  }
}

function calculateNetValue(orderValueData: OrderValueData): number | undefined {
  const grossOrderValue = makeNumber(orderValueData.grossOrderValue);
  if (typeof grossOrderValue === "undefined") {
    return undefined;
  } else {
    const shippingValue = makeNumber(orderValueData.shippingValue);
    if (typeof shippingValue === "undefined") {
      loggerError(
        "shippingValue is not defined in SovendusThankyouPage.calculateOrderValue",
        "ThankyouPage",
      );
    }
    const taxValue = calculateTaxValue(orderValueData, grossOrderValue);
    return Math.max(0, grossOrderValue - taxValue - (shippingValue || 0));
  }
}

function calculateTaxValue(
  orderValueData: OrderValueData,
  grossOrderValue: number,
): number {
  const taxValue = makeNumber(orderValueData.taxValue);
  if (typeof taxValue === "undefined") {
    const taxPercent = makeNumber(orderValueData.taxPercent);
    if (typeof taxPercent === "undefined") {
      loggerError(
        "Either taxPercent or taxValue has to be defined in SovendusThankyouPage.calculateOrderValue",
        "ThankyouPage",
      );
    } else {
      return (grossOrderValue / (1 + taxPercent / 100)) * (taxPercent / 100);
    }
  } else {
    return taxValue;
  }
  return 0;
}

export function splitStreetAndStreetNumber(street: string): [string, string] {
  const trimmedStreet = street.trim();
  // This regex looks for a street number at the end of the string.
  // It expects the number to start with at least one digit, possibly followed by digits, spaces, dashes, or slashes,
  // and optionally ending with a letter.
  const numberRegex = /(\d[\d\s/-]*[a-zA-Z]?)$/;
  const match = trimmedStreet.match(numberRegex);

  if (match && match.index !== undefined) {
    const streetNumber = match[1] ? match[1].trim() : "";
    const streetName = trimmedStreet.slice(0, match.index).trim();
    return [streetName, streetNumber];
  }
  return [street, ""];
}

export async function handleVoucherCode(
  this: SovendusThankyouPage,
  sovThankyouConfig: SovendusThankYouPageConfig,
): Promise<void> {
  const couponFromCookie = await this.getCookie("sovCouponCode");
  if (couponFromCookie) {
    this.clearCookie("sovCouponCode");
    sovThankyouConfig.orderData.usedCouponCodes = [couponFromCookie];
    return;
  }
  if (sovThankyouConfig.orderData.usedCouponCode) {
    if (!sovThankyouConfig.orderData.usedCouponCodes?.length) {
      sovThankyouConfig.orderData.usedCouponCodes = [];
    }
    sovThankyouConfig.orderData.usedCouponCodes.push(
      sovThankyouConfig.orderData.usedCouponCode,
    );
  }
}

export function initializeStatus(this: SovendusThankyouPage): IntegrationData {
  const sovThankyouStatus: IntegrationData = {
    integrationScriptVersion,
    status: {
      sovThankyouConfigFound: false,
      integrationLoaderStarted: false,
      integrationParametersLoaded: false,
      checkoutProductsPixelFired: false,
      loadedOptimize: false,
      voucherNetworkLinkTrackingSuccess: false,
      integrationLoaderVnCbStarted: false,
      integrationLoaderDone: false,
      voucherNetworkIframeContainerIdFound: false,
      voucherNetworkIframeContainerFound: false,
      countryCodePassedOnByPlugin: false,
    },
    data: {
      orderValue: undefined,
      orderCurrency: undefined,
      orderId: undefined,
      sovCouponCode: undefined,
      sovReqToken: undefined,
      puid: undefined,
      sovDebugLevel: undefined,
    },
    times: {
      integrationLoaderStart: this.getPerformanceTime(),
    },
  };
  return sovThankyouStatus;
}

export async function handleCheckoutProductsConversion(
  this: SovendusThankyouPage,
  sovThankyouConfig: SovendusThankYouPageConfig,
  sovThankyouStatus: IntegrationData,
): Promise<boolean> {
  const { checkoutProducts } = sovThankyouConfig.settings;
  if (checkoutProducts) {
    const sovReqToken = await this.getCookie("sovReqToken");
    if (sovReqToken) {
      this.clearCookie("sovReqToken");
      const pixelUrl = `https://press-order-api.sovendus.com/ext/image?sovReqToken=${decodeURIComponent(sovReqToken)}`;
      await fetch(pixelUrl);
      sovThankyouStatus.status.checkoutProductsPixelFired = true;
    }
  }
  return false;
}

export function getVoucherNetworkConfig(
  this: SovendusThankyouPage,
  sovThankyouConfig: SovendusThankYouPageConfig,
): VoucherNetworkLanguage | undefined {
  if (sovThankyouConfig.settings.voucherNetwork.settingType === "simple") {
    return sovThankyouConfig.settings.voucherNetwork.simple;
  }
  if (sovThankyouConfig.settings.voucherNetwork.settingType === "country") {
    return this.getVoucherNetworkCountryBasedSettings(sovThankyouConfig);
  }
  return undefined;
}

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
    sovThankyouConfig.settings.voucherNetwork.countries?.ids?.[country];
  const languagesSettings = countrySettings?.languages;
  if (!languagesSettings) {
    return undefined;
  }
  const languagesAvailable = Object.keys(LANGUAGES_BY_COUNTRIES[country]);
  if (languagesAvailable?.length === 1) {
    const language = languagesAvailable[0] as LanguageCodes;
    const languageSettings = languagesSettings[language];
    return {
      isEnabled: languageSettings?.isEnabled || false,
      trafficSourceNumber: languageSettings?.trafficSourceNumber || "",
      trafficMediumNumber: languageSettings?.trafficMediumNumber || "",
      ...languageSettings,
      iframeContainerQuerySelector:
        sovThankyouConfig.settings.voucherNetwork.countries
          ?.iframeContainerQuerySelector ||
        languageSettings?.iframeContainerQuerySelector,
    };
  }
  if (languagesAvailable?.length > 1) {
    const languageKey =
      sovThankyouConfig.customerData.consumerLanguage ||
      this.detectLanguageCode();
    const languageSettings = languagesSettings[languageKey];
    if (!languageSettings) {
      return undefined;
    }
    return {
      ...languageSettings,
      iframeContainerQuerySelector:
        sovThankyouConfig.settings.voucherNetwork.countries
          ?.iframeContainerQuerySelector ||
        languageSettings?.iframeContainerQuerySelector,
    };
  }
  return undefined;
}
