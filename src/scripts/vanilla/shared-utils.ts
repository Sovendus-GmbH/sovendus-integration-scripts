import type {
  ExplicitAnyType,
  SovendusAppSettings,
} from "sovendus-integration-types";
import { CountryCodes, SettingsType } from "sovendus-integration-types";

export function getPerformanceTime(): number {
  throwErrorInNonBrowserContext({
    methodName: "getPerformanceTime",
    pageType: "LandingPage",
    requiresWindow: true,
  });
  return window.performance?.now?.() || 0;
}

export function detectCountryCode(): CountryCodes | undefined {
  return (
    getCountryCodeFromHtmlTag() ||
    getCountryFromDomain() ||
    getCountryFromPagePath()
  );
}

export function getOptimizeId(
  settings: SovendusAppSettings,
  country: CountryCodes | "UK" | undefined,
): string | undefined {
  if (settings?.optimize?.settingsType === SettingsType.SIMPLE) {
    if (
      settings?.optimize?.simple?.isEnabled !== false &&
      settings?.optimize?.simple?.optimizeId
    ) {
      return settings.optimize.simple.optimizeId;
    }
  } else {
    if (settings.optimize?.countries?.ids) {
      const uncleanedCountryCode: CountryCodes | "UK" | undefined = country;
      const countryCode =
        uncleanedCountryCode === "UK" ? CountryCodes.GB : uncleanedCountryCode;
      if (countryCode) {
        const countryElement = settings.optimize.countries?.ids?.[countryCode];
        return countryElement?.isEnabled
          ? countryElement?.optimizeId
          : undefined;
      }
      const fallbackId: string | undefined =
        settings?.optimize?.countries?.fallBackId;
      if (settings.optimize?.countries.fallBackEnabled && fallbackId) {
        return fallbackId;
      }
    }
  }
  return undefined;
}

export function throwErrorInNonBrowserContext({
  methodName,
  requiresWindow,
  requiresDocument,
  pageType,
}: {
  methodName: string;
  requiresWindow?: boolean;
  requiresDocument?: boolean;
  pageType: "LandingPage" | "ThankyouPage";
}): void {
  if (
    (requiresDocument ? typeof document === "undefined" : false) ||
    (requiresWindow ? typeof window === "undefined" : false)
  ) {
    throw new Error(
      `Sovendus App [${pageType}] - ${methodName}: ${requiresWindow ? "window" : ""} ${requiresDocument ? "document" : ""} is not available in your context, you can override this method`,
    );
  }
}

const errorApi = "https://press-tracking-api.sovendus.com/error";
let errorCounter = 0;

export async function reportError(
  errorMessage: string,
  error: unknown,
  options: {
    onError?: (errorMessage: string, error: unknown) => void;
    type: string;
    trafficSourceNumber?: number;
    trafficMediumNumber?: number;
    additionalData?: Record<string, unknown>;
  },
): Promise<void> {
  try {
    errorCounter++;
    if (errorCounter > 3) {
      return;
    }

    const errorData = {
      source: `typescript-${options.type}`,
      type: "exception",
      message: errorMessage,
      counter: errorCounter,
      trafficSource: options.trafficSourceNumber ?? "not_defined",
      trafficMedium: options.trafficMediumNumber ?? "not_defined",
      additionalData: JSON.stringify({
        error: error instanceof Error ? error.toString() : String(error),
        appName: `typescript-script-${options.type}`,
        ...options.additionalData,
      }),
      implementationType: `typescript-${options.type}`,
    };

    await fetch(errorApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(errorData),
    });
  } catch (apiError) {
    options.onError?.(`Failed to report error to API: ${apiError}`, error);
  }

  options.onError?.(errorMessage, error);
}

function extractContextData(params: unknown[]): {
  trafficSourceNumber?: number;
  trafficMediumNumber?: number;
  contextData: Record<string, unknown>;
} {
  const contextData: Record<string, unknown> = {};
  let trafficSourceNumber: number | undefined;
  let trafficMediumNumber: number | undefined;

  for (const param of params) {
    if (param && typeof param === "object") {
      try {
        // Look for config objects that might contain traffic source/medium
        if (
          "settings" in param &&
          param.settings &&
          typeof param.settings === "object"
        ) {
          const settings = param.settings as Record<string, unknown>;
          if (
            settings["voucherNetwork"] &&
            typeof settings["voucherNetwork"] === "object" &&
            settings["voucherNetwork"] !== null &&
            "countries" in settings["voucherNetwork"] &&
            (settings["voucherNetwork"] as Record<string, unknown>)[
              "countries"
            ] &&
            typeof (settings["voucherNetwork"] as Record<string, unknown>)[
              "countries"
            ] === "object" &&
            (settings["voucherNetwork"] as Record<string, unknown>)[
              "countries"
            ] !== null &&
            "ids" in
              ((settings["voucherNetwork"] as Record<string, unknown>)[
                "countries"
              ] as Record<string, unknown>)
          ) {
            const countries = (
              (settings["voucherNetwork"] as Record<string, unknown>)[
                "countries"
              ] as Record<string, unknown>
            )["ids"];
            if (
              countries &&
              typeof countries === "object" &&
              countries !== null
            ) {
              for (const countryData of Object.values(countries)) {
                if (
                  countryData &&
                  typeof countryData === "object" &&
                  countryData !== null
                ) {
                  const country = countryData as Record<string, unknown>;
                  if (typeof country["trafficSourceNumber"] === "number") {
                    trafficSourceNumber = country["trafficSourceNumber"];
                  }
                  if (typeof country["trafficMediumNumber"] === "number") {
                    trafficMediumNumber = country["trafficMediumNumber"];
                  }
                }
              }
            }
          }
        }

        // Look for status objects with useful debugging info
        if ("status" in param || "data" in param || "times" in param) {
          contextData["statusInfo"] = param;
        }

        // Look for config objects
        if (
          "orderData" in param ||
          "customerData" in param ||
          "integrationType" in param
        ) {
          contextData["configInfo"] = param;
        }

        // Look for URL data
        if ("urlData" in param) {
          contextData["urlData"] = (param as Record<string, unknown>)[
            "urlData"
          ];
        }

        // Add browser/environment info if available
        if (typeof window !== "undefined") {
          contextData["browserInfo"] = {
            userAgent: window.navigator?.userAgent,
            url: window.location?.href,
            timestamp: new Date().toISOString(),
          };
        }
      } catch {
        // Ignore errors when extracting context data
      }
    }
  }

  const result: {
    trafficSourceNumber?: number;
    trafficMediumNumber?: number;
    contextData: Record<string, unknown>;
  } = {
    contextData,
  };

  if (trafficSourceNumber !== undefined) {
    result.trafficSourceNumber = trafficSourceNumber;
  }
  if (trafficMediumNumber !== undefined) {
    result.trafficMediumNumber = trafficMediumNumber;
  }

  return result;
}

export function loggerError(
  message: string,
  pageType: "LandingPage" | "ThankyouPage",
  ...other: unknown[]
): void {
  // eslint-disable-next-line no-console
  console.error(`Sovendus App [${pageType}] - ${message}`, ...other);

  // Extract context data from the other parameters
  const contextData = extractContextData(other);

  // Report error to API with full context
  const reportOptions: {
    type: string;
    trafficSourceNumber?: number;
    trafficMediumNumber?: number;
    additionalData?: Record<string, unknown>;
    onError?: (errorMessage: string, error: unknown) => void;
  } = {
    type: pageType.toLowerCase().replace("page", ""),
    additionalData: {
      pageType,
      contextData: contextData.contextData,
      otherParams: other.map((param) => {
        try {
          return typeof param === "object" && param !== null
            ? JSON.stringify(param)
            : String(param);
        } catch {
          return "[Circular or non-serializable object]";
        }
      }),
    },
    onError: (errorMessage: string, error: unknown) => {
      // Fallback console logging if API fails
      // eslint-disable-next-line no-console
      console.warn(`Failed to report error to API: ${errorMessage}`, error);
    },
  };

  if (contextData.trafficSourceNumber !== undefined) {
    reportOptions.trafficSourceNumber = contextData.trafficSourceNumber;
  }
  if (contextData.trafficMediumNumber !== undefined) {
    reportOptions.trafficMediumNumber = contextData.trafficMediumNumber;
  }

  void reportError(message, new Error(message), reportOptions);
}

export function loggerInfo(
  message: string,
  pageType: "LandingPage" | "ThankyouPage",
  ...other: unknown[]
): void {
  // eslint-disable-next-line no-console
  console.log(`Sovendus App [${pageType}] - ${message}`, ...other);
}

export function loggerInfoWithReporting(
  message: string,
  pageType: "LandingPage" | "ThankyouPage",
  shouldReport: boolean = false,
  ...other: unknown[]
): void {
  // Always log to console
  loggerInfo(message, pageType, ...other);

  // Optionally report to API for important information
  if (shouldReport) {
    const contextData = extractContextData(other);

    const reportOptions: {
      type: string;
      trafficSourceNumber?: number;
      trafficMediumNumber?: number;
      additionalData?: Record<string, unknown>;
      onError?: (errorMessage: string, error: unknown) => void;
    } = {
      type: `${pageType.toLowerCase().replace("page", "")}-info`,
      additionalData: {
        pageType,
        level: "info",
        contextData: contextData.contextData,
        otherParams: other.map((param) => {
          try {
            return typeof param === "object" && param !== null
              ? JSON.stringify(param)
              : String(param);
          } catch {
            return "[Circular or non-serializable object]";
          }
        }),
      },
      onError: (errorMessage: string, error: unknown) => {
        // Fallback console logging if API fails
        // eslint-disable-next-line no-console
        console.warn(`Failed to report info to API: ${errorMessage}`, error);
      },
    };

    if (contextData.trafficSourceNumber !== undefined) {
      reportOptions.trafficSourceNumber = contextData.trafficSourceNumber;
    }
    if (contextData.trafficMediumNumber !== undefined) {
      reportOptions.trafficMediumNumber = contextData.trafficMediumNumber;
    }

    void reportError(
      `INFO: ${message}`,
      new Error(`Info: ${message}`),
      reportOptions,
    );
  }
}

export function getCountryCodeFromHtmlTag(): CountryCodes | undefined {
  throwErrorInNonBrowserContext({
    methodName: "getCountryCodeFromHtmlTag",
    pageType: "LandingPage",
    requiresDocument: true,
  });
  const lang = document.documentElement.lang;
  const countryCode = lang.split("-")[1];
  return countryCode ? castToCountry(countryCode.toUpperCase()) : undefined;
}

export function getCountryFromDomain(): CountryCodes | undefined {
  throwErrorInNonBrowserContext({
    methodName: "getCountryFromDomain",
    pageType: "LandingPage",
    requiresWindow: true,
  });
  const domainToCountry: {
    [key: string]: string | undefined;
  } = {
    "de": "DE",
    "at": "AT",
    "ch": "CH",
    "uk": "GB",
    "co.uk": "GB",
    "com": undefined,
    "se": "SE",
    "no": "NO",
    "dk": "DK",
    "fi": "FI",
    "fr": "FR",
    "be": "BE",
    "nl": "NL",
    "it": "IT",
    "es": "ES",
    "pt": "PT",
    "pl": "PL",
    "cz": "CZ",
    "sk": "SK",
    "hu": "HU",
  };
  const domain = window.location.hostname;
  const domainParts = domain.split(".");
  const domainPart = domainParts[domainParts.length - 1];
  return (domainPart ? domainToCountry[domainPart] : undefined) as
    | CountryCodes
    | undefined;
}

export function getCountryFromPagePath(): CountryCodes | undefined {
  throwErrorInNonBrowserContext({
    methodName: "getCountryFromDomain",
    pageType: "LandingPage",
    requiresWindow: true,
  });
  const path = window.location.pathname;
  const pathParts = path.split("/");
  const country = pathParts[1];
  return castToCountry(country?.toUpperCase());
}

export function castToCountry(
  value: string | undefined,
): CountryCodes | undefined {
  if (value && Object.values(CountryCodes).includes(value as CountryCodes)) {
    return value as CountryCodes;
  }
  return undefined;
}

export function makeString(value: ExplicitAnyType): string | undefined {
  // make sure its either a valid string or undefined
  if (value === undefined) {
    return undefined;
  }
  if (typeof value === "string") {
    return value;
  }
  return undefined;
}

export function makeNumber(value: ExplicitAnyType): number | undefined {
  // make sure its either a valid number or number string or undefined
  if (value === undefined) {
    return undefined;
  }
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const number = Number(value);
    if (!Number.isNaN(number)) {
      return number;
    }
  }
  return undefined;
}
