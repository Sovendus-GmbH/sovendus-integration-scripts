import type {
  SovendusPageConfig,
  SovendusPageData,
  SovendusPageUrlParams,
  SovPageStatus,
} from "sovendus-integration-types";
import { CountryCodes } from "sovendus-integration-types";
import { sovendusPageApis } from "sovendus-integration-types";

import { integrationScriptVersion } from "../constants.js";
import {
  getCountryCodeFromHtmlTag,
  getCountryFromDomain,
  getCountryFromPagePath,
  getOptimizeId,
  loggerError,
  throwErrorOnSSR,
} from "../shared-utils.js";

export class SovendusPage {
  // Standard implementation of the Sovendus page script
  // You can extend this class and override the methods to customize the behavior
  // You can find example overrides in any of our Sovendus plugins
  // Also make sure to check out our docs for more information

  UrlParamAndCookieKeys = [
    // These are the keys that Sovendus uses to store the url params as cookies
    // Without these url params the Sovendus cookies will not be set
    //
    // key only passed on in Switzerland Voucher Network
    "puid",
    // Optional link based conversion tracking for Sovendus Voucher Network
    "sovCouponCode",
    // Key used for Sovendus Checkout Products
    "sovReqToken",
    // used to enable debug mode for the testing process.
    "sovDebugLevel",
  ] as const as (keyof SovendusPageUrlParams)[];

  // make it async to avoid blocking the main thread
  // eslint-disable-next-line @typescript-eslint/require-await
  async main(
    sovPageConfig: SovendusPageConfig,
    onDone: ({
      sovPageConfig,
      sovPageStatus,
    }: Partial<SovendusPageData>) => void,
  ): Promise<void> {
    const sovPageStatus = this.initializeStatus();
    this.processConfig(sovPageConfig, sovPageStatus);

    try {
      if (!sovPageConfig) {
        sovPageStatus.status.sovPageConfigFound = true;
        onDone({ sovPageStatus });
        loggerError("sovPageConfig is not defined", "LandingPage");
        return;
      }
      sovPageStatus.urlData = this.lookForUrlParamsToStore(sovPageStatus);
      this.sovendusOptimize(sovPageConfig, sovPageStatus);
      sovPageStatus.times.integrationLoaderDone = this.getPerformanceTime();
    } catch (error) {
      loggerError("Crash in SovendusPage.main", "LandingPage", error);
    }
    onDone({ sovPageStatus, sovPageConfig });
  }

  initializeStatus(): SovPageStatus {
    return {
      integrationScriptVersion: integrationScriptVersion,
      urlData: {
        sovCouponCode: undefined,
        sovReqToken: undefined,
        puid: undefined,
        sovDebugLevel: undefined,
      },
      status: {
        sovPageConfigFound: false,
        loadedOptimize: false,
        storedCookies: false,
        countryCodePassedOnByPlugin: false,
      },
      times: {
        integrationLoaderStart: this.getPerformanceTime(),
      },
    };
  }
  getCookieKeys(): (keyof SovendusPageUrlParams)[] {
    return this.UrlParamAndCookieKeys;
  }

  getSearchParams(): URLSearchParams {
    throwErrorOnSSR({
      methodName: "getSearchParams",
      pageType: "LandingPage",
      requiresWindow: true,
    });
    return new URLSearchParams(window.location.search);
  }

  getScriptParams(): URLSearchParams | undefined {
    throwErrorOnSSR({
      methodName: "getScriptParams",
      pageType: "LandingPage",
      requiresDocument: true,
    });
    const currentScript = document.currentScript as HTMLScriptElement | null;
    return currentScript ? new URL(currentScript.src).searchParams : undefined;
  }

  getSovendusUrlParameters(): SovendusPageUrlParams {
    const pageViewData: SovendusPageUrlParams = {
      sovCouponCode: undefined,
      sovReqToken: undefined,
      puid: undefined,
      sovDebugLevel: undefined,
    };
    const scriptUrlParams = this.getScriptParams();
    const urlParams = this.getSearchParams();
    this.getCookieKeys().forEach((dataKey) => {
      const paramValue =
        urlParams?.get(dataKey) || scriptUrlParams?.get(dataKey);
      if (paramValue) {
        if (dataKey === "sovDebugLevel") {
          if (paramValue === "debug" || paramValue === "silent") {
            pageViewData[dataKey] = paramValue;
          }
        } else {
          pageViewData[dataKey] = paramValue;
        }
      }
    });
    return pageViewData;
  }

  lookForUrlParamsToStore(sovPageStatus: SovPageStatus): SovendusPageUrlParams {
    try {
      const pageViewData: SovendusPageUrlParams =
        this.getSovendusUrlParameters();
      Object.entries(pageViewData).forEach(([cookieKey, cookieValue]) => {
        if (cookieValue) {
          // for simplicity we store all supported url params as cookies
          // as without the url params the cookies would not be set
          // you can add your custom logic here if you limit to certain url params
          this.setCookie(cookieKey, cookieValue);
          sovPageStatus.status.storedCookies = true;
        }
      });
      return pageViewData;
    } catch (error) {
      loggerError("Error while storing url params", "LandingPage", error);
    }
    return {
      sovCouponCode: undefined,
      sovReqToken: undefined,
      puid: undefined,
      sovDebugLevel: undefined,
    };
  }

  shouldSetCookie(
    _cookieKey: keyof SovendusPageUrlParams,
    _cookieValue: string,
  ): boolean {
    // for simplicity we store all supported url params as cookies
    // as without the url params the cookies would not be set anyway
    // each url param requires separate opt in on Sovendus side, so this is safe to use
    // you can add your custom logic here if you want to limit to certain url params
    return true;
  }

  setCookie(cookieName: string, value: string): void {
    throwErrorOnSSR({
      methodName: "setCookie",
      pageType: "LandingPage",
      requiresDocument: true,
      requiresWindow: true,
    });
    const path = "/";
    const expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + 24 * 60 * 60 * 1000 * 30); // 30 days
    const domain = window.location.hostname;
    const cookieString = `${cookieName}=${value};secure;samesite=strict;expires=${expireDate.toUTCString()};domain=${domain};path=${path}`;
    document.cookie = cookieString;
  }

  sovendusOptimize(
    sovPageConfig: SovendusPageConfig,
    sovPageStatus: SovPageStatus,
  ): void {
    const optimizeId = getOptimizeId(
      sovPageConfig.settings,
      sovPageConfig.country,
    );
    if (!optimizeId) {
      return;
    }
    this.handleOptimizeScript(optimizeId, sovPageConfig, sovPageStatus);
    sovPageStatus.status.loadedOptimize = true;
  }

  handleOptimizeScript(
    optimizeId: string,
    _sovPageConfig: SovendusPageConfig,
    _sovPageStatus: SovPageStatus,
  ): void {
    throwErrorOnSSR({
      methodName: "sovendusOptimize",
      pageType: "LandingPage",
      requiresDocument: true,
    });
    const script = document.createElement("script");
    script.async = true;
    script.type = "application/javascript";
    script.src = `${sovendusPageApis.optimize}${optimizeId}`;
    document.head.appendChild(script);
  }

  processConfig(
    sovPageConfig: SovendusPageConfig,
    sovPageStatus: SovPageStatus,
  ): void {
    this.handleCountryCode(sovPageConfig, sovPageStatus);
  }

  handleCountryCode(
    sovPageConfig: SovendusPageConfig,
    sovPageStatus: SovPageStatus,
  ): void {
    // using string literal "UK" intentionally despite type mismatch as some systems might return UK instead of GB
    if (sovPageConfig.country === "UK") {
      sovPageConfig.country = CountryCodes.GB;
    }
    if (!sovPageConfig.country) {
      sovPageStatus.status.countryCodePassedOnByPlugin = false;
      sovPageConfig.country = sovPageConfig.country || this.detectCountryCode();
    }
  }

  getPerformanceTime(): number {
    throwErrorOnSSR({
      methodName: "getPerformanceTime",
      pageType: "LandingPage",
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
}
