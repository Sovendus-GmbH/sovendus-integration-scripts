import type { SovendusAppSettings } from "sovendus-integration-types";
import { CountryCodes } from "sovendus-integration-types";

export function getOptimizeId(
  settings: SovendusAppSettings,
  country: CountryCodes | "UK" | undefined,
): string | undefined {
  if (settings?.optimize?.settingsType === "simple") {
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

export function throwErrorOnSSR({
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

export function loggerError(
  message: string,
  pageType: "LandingPage" | "ThankyouPage",
  ...other: unknown[]
): void {
  // eslint-disable-next-line no-console
  console.error(`Sovendus App [${pageType}] - ${message}`, ...other);
}

export function loggerInfo(
  message: string,
  pageType: "LandingPage" | "ThankyouPage",
  ...other: unknown[]
): void {
  // eslint-disable-next-line no-console
  console.log(`Sovendus App [${pageType}] - ${message}`, ...other);
}

export function getCountryCodeFromHtmlTag(): CountryCodes | undefined {
  throwErrorOnSSR({
    methodName: "getCountryCodeFromHtmlTag",
    pageType: "LandingPage",
    requiresDocument: true,
  });
  const lang = document.documentElement.lang;
  const countryCode = lang.split("-")[1];
  return countryCode ? castToCountry(countryCode.toUpperCase()) : undefined;
}

export function getCountryFromDomain(): CountryCodes | undefined {
  throwErrorOnSSR({
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
  throwErrorOnSSR({
    methodName: "getCountryFromDomain",
    pageType: "LandingPage",
    requiresWindow: true,
  });
  const path = window.location.pathname;
  const pathParts = path.split("/");
  const country = pathParts[1];
  return castToCountry(country?.toUpperCase());
}

function castToCountry(value: string | undefined): CountryCodes | undefined {
  if (value && Object.values(CountryCodes).includes(value as CountryCodes)) {
    return value as CountryCodes;
  }
  return undefined;
}
