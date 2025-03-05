import type {
  IntegrationData,
  LanguageCodes,
  SovendusConsumerData,
  SovendusPageUrlParams,
  SovendusThankYouPageConfig,
  SovendusThankyouPageData,
  SovendusVNConversion,
  VoucherNetworkLanguage,
} from "sovendus-integration-types";
import {
  CountryCodes,
  defaultIframeContainerId,
  LANGUAGES_BY_COUNTRIES,
} from "sovendus-integration-types";

import { integrationScriptVersion } from "../constants";
import {
  getCountryCodeFromHtmlTag,
  getCountryFromDomain,
  getCountryFromPagePath,
  getOptimizeId,
  loggerError,
  throwErrorOnSSR,
} from "../shared-utils";

export class SovendusThankyouPage {
  async main(
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

  async processConfig(
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ): Promise<void> {
    await this.handleVoucherCode(sovThankyouConfig);
    this.handleStreet(sovThankyouConfig);
    this.handleCountryCode(sovThankyouConfig, sovThankyouStatus);
  }

  handleCountryCode(
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
    }
  }

  async handleOptimizeConversion(
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

  // Is async in case the plugin needs to wait for the script to load
  // eslint-disable-next-line @typescript-eslint/require-await
  async handleOptimizeConversionScript(
    optimizeId: string,
    couponCode: string | undefined,
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ): Promise<void> {
    throwErrorOnSSR({
      methodName: "handleOptimizeConversionScript",
      pageType: "ThankyouPage",
      requiresDocument: true,
    });
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `https://www.sovopt.com/${optimizeId}/conversion/?ordervalue=${
      sovThankyouConfig.orderData.orderValue
    }&ordernumber=${sovThankyouConfig.orderData.orderId}&vouchercode=${
      couponCode
    }&email=${sovThankyouConfig.customerData.consumerEmail}`;
    document.body.appendChild(script);
    sovThankyouStatus.status.loadedOptimize = true;
  }

  handleStreet(sovThankyouConfig: SovendusThankYouPageConfig): void {
    if (sovThankyouConfig.customerData.consumerStreetWithNumber) {
      const [street, streetNumber] = this.splitStreetAndStreetNumber(
        sovThankyouConfig.customerData.consumerStreetWithNumber,
      );
      sovThankyouConfig.customerData.consumerStreet = street;
      sovThankyouConfig.customerData.consumerStreetNumber = streetNumber;
    }
  }

  splitStreetAndStreetNumber(street: string): [string, string] {
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

  async handleVoucherCode(
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

  initializeStatus(): IntegrationData {
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

  handleVoucherNetwork(
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ): void {
    throwErrorOnSSR({
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
        sovThankyouStatus,
      );
      window.sovIframes = window.sovIframes || [];
      window.sovIframes.push({
        trafficSourceNumber: voucherNetworkConfig.trafficSourceNumber,
        trafficMediumNumber: voucherNetworkConfig.trafficMediumNumber,
        sessionId: sovThankyouConfig.orderData.sessionId,
        orderId: sovThankyouConfig.orderData.orderId,
        orderValue: sovThankyouConfig.orderData.orderValue,
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

  handleSovendusVoucherNetworkDivContainer(
    voucherNetworkConfig: VoucherNetworkLanguage,
    sovThankyouStatus: IntegrationData,
  ): string {
    throwErrorOnSSR({
      methodName: "handleSovendusVoucherNetworkDivContainer",
      pageType: "ThankyouPage",
      requiresDocument: true,
      requiresWindow: true,
    });
    const iframeContainerId = defaultIframeContainerId;
    const rootElement =
      iframeContainerId && document.getElementById(iframeContainerId);
    if (!rootElement) {
      if (voucherNetworkConfig.iframeContainerQuerySelector) {
        const iframeContainer = document.querySelector(
          voucherNetworkConfig.iframeContainerQuerySelector,
        );
        if (iframeContainer) {
          const sovendusDiv = document.createElement("div");
          sovendusDiv.id = defaultIframeContainerId;
          iframeContainer.appendChild(sovendusDiv);
          sovThankyouStatus.status.voucherNetworkIframeContainerIdFound = true;
          sovThankyouStatus.status.voucherNetworkIframeContainerFound = true;
        } else {
          sovThankyouStatus.status.voucherNetworkIframeContainerFound = false;
          sovThankyouStatus.status.voucherNetworkIframeContainerIdFound = true;
          loggerError(
            `Voucher Network custom iframe container ${voucherNetworkConfig.iframeContainerQuerySelector} not found`,
            "ThankyouPage",
          );
          return "";
        }
      } else {
        sovThankyouStatus.status.voucherNetworkIframeContainerFound = false;
        sovThankyouStatus.status.voucherNetworkIframeContainerIdFound = false;
        loggerError(
          "Voucher Network iframe container not found",
          "ThankyouPage",
        );
        return "";
      }
    } else {
      sovThankyouStatus.status.voucherNetworkIframeContainerFound = true;
      sovThankyouStatus.status.voucherNetworkIframeContainerIdFound = true;
    }
    return iframeContainerId;
  }

  async handleCheckoutProductsConversion(
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ): Promise<boolean> {
    const { checkoutProducts } = sovThankyouConfig.settings;
    if (checkoutProducts) {
      const sovReqToken = await this.getCookie("sovReqToken");
      if (sovReqToken) {
        // remove the cooky
        this.clearCookie("sovReqToken");
        const pixelUrl = `https://press-order-api.sovendus.com/ext/image?sovReqToken=${decodeURIComponent(sovReqToken)}`;
        await fetch(pixelUrl);
        sovThankyouStatus.status.checkoutProductsPixelFired = true;
      }
    }
    return false;
  }

  // make it async as some platforms might need to wait for the cookies
  // eslint-disable-next-line @typescript-eslint/require-await
  async getCookie(
    name: keyof SovendusPageUrlParams,
  ): Promise<string | undefined> {
    throwErrorOnSSR({
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
    throwErrorOnSSR({
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

  getVoucherNetworkConfig(
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

  getVoucherNetworkCountryBasedSettings(
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

  detectLanguageCode(): LanguageCodes {
    throwErrorOnSSR({
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

  getPerformanceTime(): number {
    throwErrorOnSSR({
      methodName: "getPerformanceTime",
      pageType: "ThankyouPage",
      requiresWindow: true,
    });
    return window.performance?.now?.() || 0;
  }

  detectCountryCode(): CountryCodes | undefined {
    return (
      getCountryCodeFromHtmlTag() ||
      getCountryFromDomain() ||
      getCountryFromPagePath()
    );
  }

  unmount(): void {
    // TODO
  }
}

interface ThankYouWindow extends Window {
  sovIframes: SovendusVNConversion[];
  sovConsumer: SovendusConsumerData;
}
declare let window: ThankYouWindow;
