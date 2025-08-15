import type {
  ExplicitAnyType,
  SovendusAppSettings,
} from "sovendus-integration-types";
import { CountryCodes, SettingsType } from "sovendus-integration-types";

export function getPerformanceTime(): number {
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
  const lang = document.documentElement.lang;
  const countryCode = lang.split("-")[1];
  return countryCode ? castToCountry(countryCode.toUpperCase()) : undefined;
}

export function getCountryFromDomain(): CountryCodes | undefined {
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
  if (!value) {
    return undefined;
  }
  if (typeof value === "string") {
    return value;
  }
  return undefined;
}

export function makeNumber(value: ExplicitAnyType): number | undefined {
  // make sure its either a valid number or number string or undefined
  if (!value && value !== 0) {
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
