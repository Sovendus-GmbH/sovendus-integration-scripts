import type {
  SovendusPageConfig,
  SovendusPageData,
  SovendusPageUrlParams,
  SovPageStatus,
} from "sovendus-integration-types";
import { CountryCodes } from "sovendus-integration-types";
import { sovendusPageApis } from "sovendus-integration-types";

import { integrationScriptVersion } from "../constants";
import {
  getCountryCodeFromHtmlTag,
  getCountryFromDomain,
  getCountryFromPagePath,
  getOptimizeId,
  loggerError,
  throwErrorInNonBrowserContext,
} from "../shared-utils";

export class SovendusPage {
  // Standard implementation of the Sovendus page script
  // You can extend this class and override the methods to customize the behavior
  // You can find example overrides in any of our Sovendus plugins
  // Also make sure to check out our docs for more information

  UrlParamAndCookieKeys = [
    // These are the keys that Sovendus uses to store the url params as cookies
    // for simplicity we store all supported url params as cookies
    // as without the url params the cookies would not be set anyway
    // each url param requires separate opt in on Sovendus side, so this is safe to use
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

  async main(
    sovPageConfig: SovendusPageConfig,
    onDone: ({ sovPageConfig, sovPageStatus }: SovendusPageData) => void,
  ): Promise<void> {
    const sovPageStatus = this.initializeStatus();
    this.processConfig(sovPageConfig, sovPageStatus);

    try {
      if (!sovPageConfig) {
        sovPageStatus.status.sovPageConfigFound = true;
        onDone({ sovPageStatus, sovPageConfig });
        loggerError("sovPageConfig is not defined", "LandingPage");
        return;
      }
      sovPageStatus.urlData = await this.lookForUrlParamsToStore(sovPageStatus);
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

  // make it async as some context might require it
  // eslint-disable-next-line @typescript-eslint/require-await
  async getSearchParams(): Promise<URLSearchParams> {
    throwErrorInNonBrowserContext({
      methodName: "getSearchParams",
      pageType: "LandingPage",
      requiresWindow: true,
    });
    return new URLSearchParams(window.location.search);
  }

  async getSovendusUrlParameters(): Promise<SovendusPageUrlParams> {
    const pageViewData: SovendusPageUrlParams = {
      sovCouponCode: undefined,
      sovReqToken: undefined,
      puid: undefined,
      sovDebugLevel: undefined,
    };
    const urlParams = await this.getSearchParams();
    this.UrlParamAndCookieKeys.forEach((dataKey) => {
      const paramValue = urlParams?.get(dataKey);
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

  async lookForUrlParamsToStore(
    sovPageStatus: SovPageStatus,
  ): Promise<SovendusPageUrlParams> {
    try {
      const pageViewData: SovendusPageUrlParams =
        await this.getSovendusUrlParameters();
      await Promise.all(
        Object.entries(pageViewData).map(async ([cookieKey, cookieValue]) => {
          if (cookieValue) {
            // for simplicity we store all supported url params as cookies
            // as without the url params the cookies would not be set anyway
            // each url param requires separate opt in on Sovendus side, so this is safe to use
            // you can add your custom logic here if you want to limit to certain url params
            await this.setCookie(cookieKey, cookieValue);
            sovPageStatus.status.storedCookies = true;
          }
        }),
      );
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

  // make it async as some context might require it
  // eslint-disable-next-line @typescript-eslint/require-await
  async setCookie(cookieName: string, value: string): Promise<void> {
    throwErrorInNonBrowserContext({
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

  optimizeScriptId = "sovendus-optimize-script";

  handleOptimizeScript(
    optimizeId: string,
    _sovPageConfig: SovendusPageConfig,
    _sovPageStatus: SovPageStatus,
  ): void {
    throwErrorInNonBrowserContext({
      methodName: "sovendusOptimize",
      pageType: "LandingPage",
      requiresDocument: true,
    });
    const script = document.createElement("script");
    script.async = true;
    script.id = this.optimizeScriptId;
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
    throwErrorInNonBrowserContext({
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

  unmount(): void {
    document.getElementById(this.optimizeScriptId)?.remove();
  }
}
