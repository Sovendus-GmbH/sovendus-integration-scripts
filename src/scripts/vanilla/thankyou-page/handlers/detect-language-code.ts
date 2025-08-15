import type { CountryCodes, LanguageCodes } from "sovendus-integration-types";
import { LANGUAGES_BY_COUNTRIES } from "sovendus-integration-types";

import type { SovendusThankyouPage } from "../thankyou-page-handler";

export function detectLanguageCode(
  this: SovendusThankyouPage,
  country: CountryCodes,
): LanguageCodes | undefined {
  const rawHtml = (document?.documentElement?.lang || "").trim();
  const rawNav = (navigator?.language || "").trim();
  const htmlLang = (rawHtml.split("-")[0] || "").toUpperCase();
  const navLang = (rawNav.split("-")[0] || "").toUpperCase();

  if (htmlLang) {
    return htmlLang.toLowerCase() as LanguageCodes;
  }
  if (navLang) {
    return navLang.toLowerCase() as LanguageCodes;
  }

  // pick a sane default from the allowed set
  if (country) {
    const available = LANGUAGES_BY_COUNTRIES?.[country];
    const keys = available ? Object.keys(available) : [];
    if (keys.length > 0) {
      return (keys[0] || "").toUpperCase() as LanguageCodes;
    }
  }
  return undefined;
}
