import type {
  CountryCodes,
  IframeContainerQuerySelectorSettings,
  IntegrationData,
  LanguageCodes,
  SovendusConsumerData,
  SovendusPageUrlParams,
  SovendusThankYouPageConfig,
  SovendusThankyouPageData,
  SovendusVNConversion,
  VoucherNetworkLanguage,
} from "sovendus-integration-types";
import { defaultIframeContainerQuerySelector } from "sovendus-integration-types";

import {
  detectCountryCode,
  getPerformanceTime,
  loggerError,
  throwErrorInNonBrowserContext,
} from "../shared-utils";
import {
  getVoucherNetworkConfig,
  getVoucherNetworkCountryBasedSettings,
  handleCheckoutProductsConversion,
  handleCountryCode,
  handleOptimizeConversion,
  handleOrderValue,
  handleStreet,
  handleVoucherCode,
  initializeStatus,
  processConfig,
  sovendusThankyouMain,
  splitStreetAndStreetNumber,
} from "./utils";

export class SovendusThankyouPage {
  // Standard implementation of the Sovendus thankyou page script
  // You can extend this class and override the methods to customize the behavior
  // You can find example overrides in any of our Sovendus plugins
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

  // Is async in case the plugin needs to wait for the script to load
  handleOptimizeConversionScript(
    optimizeId: string,
    couponCode: string | undefined,
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ): Promise<void> | void {
    throwErrorInNonBrowserContext({
      methodName: "handleOptimizeConversionScript",
      pageType: "ThankyouPage",
      requiresDocument: true,
    });
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `https://www.sovopt.com/${optimizeId}/conversion/?ordervalue=${
      sovThankyouConfig.orderData.orderValue?.netOrderValue
    }&ordernumber=${sovThankyouConfig.orderData.orderId}&vouchercode=${
      couponCode
    }&email=${sovThankyouConfig.customerData.consumerEmail}`;
    document.body.appendChild(script);
    sovThankyouStatus.status.loadedOptimize = true;
  }

  handleStreet: (sovThankyouConfig: SovendusThankYouPageConfig) => void =
    handleStreet;

  splitStreetAndStreetNumber: (street: string) => [string, string] =
    splitStreetAndStreetNumber;

  handleVoucherCode: (
    sovThankyouConfig: SovendusThankYouPageConfig,
  ) => Promise<void> = handleVoucherCode;

  initializeStatus: () => IntegrationData = initializeStatus;

  handleVoucherNetwork(
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ): void {
    throwErrorInNonBrowserContext({
      methodName: "handleSovendusVoucherNetworkDivContainer",
      pageType: "ThankyouPage",
      requiresDocument: true,
      requiresWindow: true,
    });
    const voucherNetworkConfig =
      this.getVoucherNetworkConfig(sovThankyouConfig);
    // TODO handle multiple coupon codes
    const couponCode = sovThankyouConfig.orderData.usedCouponCodes?.[0];
    if (
      voucherNetworkConfig?.trafficSourceNumber &&
      voucherNetworkConfig?.trafficMediumNumber &&
      voucherNetworkConfig?.isEnabled
    ) {
      const iframeContainerId = this.handleSovendusVoucherNetworkDivContainer(
        voucherNetworkConfig,
        sovThankyouConfig,
        sovThankyouStatus,
      );
      window.sovIframes = window.sovIframes || [];
      window.sovIframes.push({
        trafficSourceNumber: voucherNetworkConfig.trafficSourceNumber,
        trafficMediumNumber: voucherNetworkConfig.trafficMediumNumber,
        sessionId: sovThankyouConfig.orderData.sessionId,
        orderId: sovThankyouConfig.orderData.orderId,
        orderValue: sovThankyouConfig.orderData.orderValue?.netOrderValue,
        orderCurrency: sovThankyouConfig.orderData.orderCurrency,
        usedCouponCode: couponCode,
        iframeContainerId: iframeContainerId,
        integrationType: sovThankyouConfig.integrationType,
      });
      window.sovConsumer = {
        consumerFirstName: sovThankyouConfig.customerData.consumerFirstName,
        consumerLastName: sovThankyouConfig.customerData.consumerLastName,
        consumerEmail: sovThankyouConfig.customerData.consumerEmail,
        consumerStreet: sovThankyouConfig.customerData.consumerStreet,
        consumerStreetNumber:
          sovThankyouConfig.customerData.consumerStreetNumber,
        consumerZipcode: sovThankyouConfig.customerData.consumerZipcode,
        consumerCity: sovThankyouConfig.customerData.consumerCity,
        consumerCountry: sovThankyouConfig.customerData.consumerCountry,
        consumerPhone: sovThankyouConfig.customerData.consumerPhone,
        consumerLanguage: sovThankyouConfig.customerData.consumerLanguage,
      };

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src =
        "https://api.sovendus.com/sovabo/common/js/flexibleIframe.js";
      document.body.appendChild(script);
      sovThankyouStatus.status.integrationLoaderVnCbStarted = true;
      sovThankyouStatus.times.integrationLoaderVnCbStart =
        this.getPerformanceTime();
    }
  }

  handleOrderValue: (sovThankyouConfig: SovendusThankYouPageConfig) => void =
    handleOrderValue;

  handleSovendusVoucherNetworkDivContainer(
    voucherNetworkConfig: VoucherNetworkLanguage,
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ): string  {
    throwErrorInNonBrowserContext({
      methodName: "handleSovendusVoucherNetworkDivContainer",
      pageType: "ThankyouPage",
      requiresDocument: true,
      requiresWindow: true,
    });
    const iframeContainerSettings = this.getIframeQuerySelector(
      voucherNetworkConfig,
      sovThankyouConfig,
    );
    const rootElement = document.querySelector(
      iframeContainerSettings.selector,
    );
    if (rootElement) {
      if (iframeContainerSettings.where === "none") {
        return rootElement.id;
      }
      const sovendusDiv = document.createElement("div");
      sovendusDiv.id = "sovendus-container";
      rootElement.insertAdjacentElement(
        iframeContainerSettings.where,
        sovendusDiv,
      );
      sovThankyouStatus.status.voucherNetworkIframeContainerFound = true;
      return sovendusDiv.id;
    } else {
      sovThankyouStatus.status.voucherNetworkIframeContainerFound = false;
      loggerError(
        `Voucher Network container query selector ${iframeContainerSettings.selector} not found`,
        "ThankyouPage",
      );
      return "";
    }
  }

  getIframeQuerySelector(
    voucherNetworkConfig: VoucherNetworkLanguage,
    sovThankyouConfig: SovendusThankYouPageConfig,
  ): IframeContainerQuerySelectorSettings {
    if (voucherNetworkConfig.iframeContainerQuerySelector) {
      return voucherNetworkConfig.iframeContainerQuerySelector;
    }
    if (sovThankyouConfig.iframeContainerQuerySelector) {
      return sovThankyouConfig.iframeContainerQuerySelector;
    }
    loggerError(
      "No iframeContainerQuerySelector found in SovendusThankYouPageConfig, trying default",
      "ThankyouPage",
    );
    return defaultIframeContainerQuerySelector;
  }

  handleCheckoutProductsConversion: (
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ) => Promise<boolean> = handleCheckoutProductsConversion;

  // make it async as some platforms might need to wait for the cookies
  getCookie(
    name: keyof SovendusPageUrlParams,
  ): Promise<string | undefined> | string | undefined {
    throwErrorInNonBrowserContext({
      methodName: "getCookie",
      pageType: "ThankyouPage",
      requiresDocument: true,
    });
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift();
    }
    return undefined;
  }

  clearCookie(name: keyof SovendusPageUrlParams): void {
    throwErrorInNonBrowserContext({
      methodName: "clearCookie",
      pageType: "ThankyouPage",
      requiresDocument: true,
      requiresWindow: true,
    });
    // only capable clearing a cookie
    const path = "/";
    const domain = window.location.hostname;
    const cookieString = `${name}=;secure;samesite=strict;expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=${domain};path=${path}`;

    document.cookie = cookieString;
  }

  getVoucherNetworkConfig: (
    sovThankyouConfig: SovendusThankYouPageConfig,
  ) => VoucherNetworkLanguage | undefined = getVoucherNetworkConfig;

  getVoucherNetworkCountryBasedSettings: (
    sovThankyouConfig: SovendusThankYouPageConfig,
  ) => VoucherNetworkLanguage | undefined =
    getVoucherNetworkCountryBasedSettings;

  detectLanguageCode(): LanguageCodes {
    throwErrorInNonBrowserContext({
      methodName: "getCookie",
      pageType: "ThankyouPage",
      requiresDocument: true,
    });
    const htmlLang = document.documentElement.lang.split("-")[0];
    if (htmlLang) {
      return htmlLang as LanguageCodes;
    }
    return navigator.language.split("-")[0] as LanguageCodes;
  }

  getPerformanceTime: () => number = getPerformanceTime;

  detectCountryCode: () => CountryCodes | undefined = detectCountryCode;

  unmount(): void {
    // TODO
  }
}

interface ThankYouWindow extends Window {
  sovIframes: SovendusVNConversion[];
  sovConsumer: SovendusConsumerData;
}
declare let window: ThankYouWindow;
