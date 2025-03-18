import type {
  CountryCodes,
  SovendusPageConfig,
  SovendusPageData,
  SovendusPageUrlParams,
  SovPageStatus,
} from "sovendus-integration-types";
import { sovendusPageApis } from "sovendus-integration-types";

import {
  detectCountryCode,
  getPerformanceTime,
  throwErrorInNonBrowserContext,
} from "../shared-utils";
import {
  getSovendusUrlParameters,
  handlePageCountryCode,
  initializePageStatus,
  lookForUrlParamsToStore,
  optimizeScriptId,
  processPageConfig,
  sovendusOptimize,
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

  initializeStatus: () => SovPageStatus = initializePageStatus;

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

  sovendusOptimize: (
    sovPageConfig: SovendusPageConfig,
    sovPageStatus: SovPageStatus,
  ) => void = sovendusOptimize;

  optimizeScriptId = optimizeScriptId;

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
  ) => void = processPageConfig;

  handleCountryCode: (
    sovPageConfig: SovendusPageConfig,
    sovPageStatus: SovPageStatus,
  ) => void = handlePageCountryCode;

  getPerformanceTime: () => number = getPerformanceTime;

  detectCountryCode: () => CountryCodes | undefined = detectCountryCode;

  unmount(): void {
    document.getElementById(this.optimizeScriptId)?.remove();
  }
}
