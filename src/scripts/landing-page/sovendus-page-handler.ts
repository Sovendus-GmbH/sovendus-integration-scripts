import type {
  SovendusPageConfig,
  SovendusPageData,
  SovendusPageUrlParams,
  SovPageStatus,
} from "sovendus-integration-types";
import { CountryCodes, sovendusPageApis } from "sovendus-integration-types";

import {
  getCountryCodeFromHtmlTag,
  getCountryFromDomain,
  getCountryFromPagePath,
  getOptimizeId,
  throwErrorInNonBrowserContext,
} from "../shared-utils";
import {
  getSovendusUrlParameters,
  initializeStatus,
  lookForUrlParamsToStore,
  processConfig,
  sovendusPageMain,
  urlParamAndCookieKeys,
} from "./utils";

export class SovendusPage {
  // Standard implementation of the Sovendus page script
  // You can extend this class and override the methods to customize the behavior
  // You can find example overrides in any of our Sovendus plugins
  // Also make sure to check out our docs for more information

  urlParamAndCookieKeys: (keyof SovendusPageUrlParams)[] =
    urlParamAndCookieKeys;

  main: (
    sovPageConfig: SovendusPageConfig,
    onDone: ({ sovPageConfig, sovPageStatus }: SovendusPageData) => void,
  ) => Promise<void> = sovendusPageMain;

  initializeStatus: () => SovPageStatus = initializeStatus;

  // make it async as some context might require it
  getSearchParams(): Promise<URLSearchParams> | URLSearchParams {
    throwErrorInNonBrowserContext({
      methodName: "getSearchParams",
      pageType: "LandingPage",
      requiresWindow: true,
    });
    return new URLSearchParams(window.location.search);
  }

  getSovendusUrlParameters: () => Promise<SovendusPageUrlParams> =
    getSovendusUrlParameters;

  lookForUrlParamsToStore: (
    sovPageStatus: SovPageStatus,
  ) => Promise<SovendusPageUrlParams> = lookForUrlParamsToStore;

  // make it async as some context might require it
  setCookie(cookieName: string, value: string): Promise<void> | void {
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

  processConfig: (
    sovPageConfig: SovendusPageConfig,
    sovPageStatus: SovPageStatus,
  ) => void = processConfig;

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
