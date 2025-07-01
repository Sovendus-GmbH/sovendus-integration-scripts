import type { Dispatch, SetStateAction } from "react";
import { useMemo } from "react";
import { handleCouponCodes } from "sovendus-integration-scripts";
import type { CountryCodes } from "sovendus-integration-types";

import { enableUserDataTransmission } from "./enableUserDataTransmission";
import { loggerError, md5 } from "./utils";
import { voucherCodePrefix } from "./voucherCodePrefix";

export function useGetTrafficNumbers(
  sovendusSettings: StoredVNFormData,
  language: string,
  country: string,
): [boolean, string, string] | [boolean, undefined, undefined] {
  return useMemo(():
    | [boolean, string, string]
    | [boolean, undefined, undefined] => {
    if (!sovendusSettings) {
      // eslint-disable-next-line no-console
      console.error(
        "Sovendus app (banner) - Sovendus settings are not defined, this might change on next render",
      );
      return [false, undefined, undefined];
    }
    const countrySettings = getCountrySettings(
      sovendusSettings,
      language,
      country,
    );
    const trafficSourceNumber = countrySettings?.[0];
    const trafficMediumNumber = countrySettings?.[1];
    const isEnabled = Boolean(
      countrySettings?.[2] && trafficSourceNumber && trafficMediumNumber,
    );
    if (!isEnabled) {
      // eslint-disable-next-line no-console
      console.log(
        "Sovendus app (banner) - Sovendus is integrated, but is not activated",
      );
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `Sovendus app (banner) - trafficSourceNumber: ${trafficSourceNumber}, trafficMediumNumber: ${trafficMediumNumber}`,
      );
    }
    // eslint-disable-next-line no-console
    console.log(
      `Sovendus app (banner) - country code: ${language}-${country}`,
      " - settings by country: ",
      JSON.stringify(sovendusSettings),
    );
    return isEnabled && trafficSourceNumber && trafficMediumNumber
      ? [isEnabled, trafficSourceNumber, trafficMediumNumber]
      : [false, undefined, undefined];
  }, [country, language, sovendusSettings]);
}

function getCountrySettings(
  sovendusSettings: StoredVNFormData,
  language: string | undefined,
  country: string | undefined,
): StoredVNFormDataElement | undefined {
  if (!country) {
    // eslint-disable-next-line no-console
    console.log(
      "Sovendus app (banner) - Country is not defined - Wont be able to execute sovendus",
    );
    return undefined;
  }
  const countryLocales = Object.entries(sovendusSettings)
    .filter(([localeCode, settings]) => {
      const isEnabled = settings[2] && Boolean(settings[0] && settings[1]);
      return isEnabled && localeCode.split("-")[1] === country;
    })
    .map(([key]) => key) as VoucherNetworkCountryCode[];
  if (countryLocales.length === 0) {
    // eslint-disable-next-line no-console
    console.log(`Sovendus app (banner) - Country: ${country} is not enabled`);
    return undefined;
  }
  const firstLocale = countryLocales[0] as VoucherNetworkCountryCode;
  if (countryLocales.length === 1) {
    // eslint-disable-next-line no-console
    console.log(
      `Sovendus app (banner) - Country: ${country} has only one locale: ${firstLocale} - using:`,
      sovendusSettings[firstLocale],
    );
    return sovendusSettings[firstLocale];
  }
  if (!language) {
    // eslint-disable-next-line no-console
    console.log(
      `Sovendus app (banner) - Language is not defined will fall back to first locale: ${firstLocale} - using:`,
      firstLocale,
      sovendusSettings[firstLocale],
    );
    return sovendusSettings[firstLocale];
  }
  const locale =
    `${language.toLowerCase()}-${country.toUpperCase()}` as VoucherNetworkCountryCode;

  if (sovendusSettings[locale]) {
    // eslint-disable-next-line no-console
    console.log(
      `Sovendus app (banner) - Country: ${country} has multiple locales: ${countryLocales} - using:`,
      locale,
      sovendusSettings[locale],
    );
    return sovendusSettings[locale];
  }
  // eslint-disable-next-line no-console
  console.log(
    `Sovendus app (banner) - Country: ${country} has multiple locales: ${countryLocales} - but no settings for locale: ${locale} - using:`,
    firstLocale,
    sovendusSettings[firstLocale],
  );
  return sovendusSettings[firstLocale];
}

// Testing URL for development purposes
// const testingUrl = "https://benefits-api.testing6.sovendus.com/v2/list";

export async function getBannerData({
  setBannerData,
  trafficSourceNumber,
  trafficMediumNumber,
  orderConfirmationNumber,
  netOrderValue,
  currency,
  voucherCodes,
  email,
  phone,
  country,
  firstName,
  lastName,
  city,
  zip,
}: {
  setBannerData: Dispatch<SetStateAction<SovendusResponseParsed>>;
  trafficSourceNumber: string;
  trafficMediumNumber: string;
  orderConfirmationNumber: string;
  netOrderValue: number;
  voucherCodes: string[];
  currency: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  city: string;
  zip: string;
  country: CountryCodes;
}): Promise<void> {
  const url = "https://benefits-api.sovendus.com/v2/list";
  const shouldPassOrderData =
    voucherCodes?.[0] &&
    (!voucherCodePrefix ||
      !!voucherCodePrefix?.find((prefix) =>
        voucherCodes[0]?.toLowerCase().startsWith(prefix),
      ));
  const personalData: PersonalData = {
    firstName: enableUserDataTransmission ? firstName : undefined,
    lastName: enableUserDataTransmission ? lastName : undefined,
    city: enableUserDataTransmission ? city : undefined,
    email: enableUserDataTransmission ? email : undefined,
    phone: enableUserDataTransmission ? phone : undefined,
    dateOfBirth: undefined, // not available on Shopify
    street: undefined, // TODO
    streetNumber: undefined, // TODO
    salutation: undefined, // not available on Shopify
    yearOfBirth: undefined, // not available on Shopify
    zipCode: enableUserDataTransmission ? zip : undefined,
  };
  const body: BannerRequestData = {
    trafficSourceNumber,
    trafficMediumNumber,
    ...(shouldPassOrderData && orderConfirmationNumber
      ? { orderId: orderConfirmationNumber }
      : {}),
    ...(shouldPassOrderData && netOrderValue
      ? { orderValue: String(netOrderValue) }
      : {}),
    ...(shouldPassOrderData && currency ? { orderCurrency: currency } : {}),
    ...(shouldPassOrderData && voucherCodes?.[0]
      ? { usedCouponCode: voucherCodes[0] }
      : {}),
    country,
    withSetup: "list,json",
    ...(personalData.salutation ? { salutation: personalData.salutation } : {}),
    ...(personalData.yearOfBirth
      ? { yearOfBirth: personalData.yearOfBirth }
      : {}),
    ...(personalData?.zipCode ? { zipCode: personalData.zipCode } : {}),
    ...(personalData.email
      ? { consumerEmailHash: md5(personalData.email) }
      : {}),

    firstNameExists: !!personalData.firstName,
    lastNameExists: !!personalData.lastName,
    emailExists: !!personalData.email,
    cityExists: !!personalData.city,
    streetExists: !!personalData.street,
    streetNumberExists: !!personalData.streetNumber,
    dateOfBirthExists: !!personalData.dateOfBirth,

    sandbox: false,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const responseJSON: SovendusResponseRaw = await response.json();
      if (responseJSON) {
        const parsedData = parseResponseData(responseJSON, personalData);
        setBannerData(parsedData);
      } else {
        // eslint-disable-next-line no-console
        console.error("Sovendus App (Banner) - failed to get banner data");
      }
    } else {
      // eslint-disable-next-line no-console
      console.log(
        "Sovendus App (Banner) - It seems like no Traffic Source Number is set.",
      );
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(
      "Sovendus App (Banner) - Failed to get sovendus response data error: ",
      error,
    );
  }
  if (!voucherCodePrefix) {
    void handleCouponCodes(
      {
        orderId: orderConfirmationNumber,
        orderValue: { netOrderValue },
        usedCouponCodes: voucherCodes,
      },
      trafficSourceNumber,
    );
  }
}

interface PersonalData {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  zipCode: string | undefined;
  city: string | undefined;
  street: string | undefined;
  streetNumber: string | undefined;
  dateOfBirth: string | undefined;
  salutation: "Mr." | "Mrs." | undefined;
  yearOfBirth: number | undefined;
}

function parseResponseData(
  responseData: SovendusResponseRaw,
  personalData: PersonalData,
): SovendusResponseParsed {
  const { deviceContentKey } = getDeviceType(
    responseData.deviceType,
    undefined,
  );
  const cbData = parseCbResponseData(
    responseData,
    personalData,
    deviceContentKey,
  );

  return {
    list: cbData,
    banner: parseBannerResponseData(
      responseData,
      personalData,
      deviceContentKey,
    ),
    deviceType: responseData.deviceType || "DESKTOP",
  };
}

function parseBannerResponseData(
  responseData: SovendusResponseRaw,
  personalData: PersonalData,
  deviceContentKey: "desktop" | "mobile",
): BannerResponseParsed | undefined {
  const rawBanner = responseData?.banner;
  if (!rawBanner) {
    return undefined;
  }
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
  // parse personalized banner variable
  const title = rawBanner.title;
  if (!title) {
    loggerError(
      "Title is not defined, but banner is, rendering will be cancelled",
      "ThankyouPage",
      "response:",
      responseData,
    );
    return undefined;
  }
  const selectVoucherText = rawBanner.selectVoucherText;
  if (!selectVoucherText) {
    loggerError(
      "Select voucher text is not defined, but banner is, rendering will be cancelled",
      "ThankyouPage",
      "response:",
      responseData,
    );
    return undefined;
  }

  if (!rawBanner.bannerUrl) {
    loggerError(
      "Banner URL is not defined, but banner is, rendering will be cancelled",
      "ThankyouPage",
      "response:",
      responseData,
    );
    return undefined;
  }
  const bannerUrl = addHashParams(rawBanner.bannerUrl, personalData);
  const dataUsageText = rawBanner.dataUsageText;
  if (!dataUsageText) {
    loggerError(
      "Data usage text is not defined, but banner is, rendering will be cancelled",
      "ThankyouPage",
      "response:",
      responseData,
    );
    return undefined;
  }
  const description = rawBanner.description;
  if (!description) {
    loggerError(
      "Description is not defined, but banner is, rendering will be cancelled",
      "ThankyouPage",
      "response:",
      responseData,
    );
    return undefined;
  }
  const imageUrl = rawBanner.imageUrl;
  if (!imageUrl) {
    loggerError(
      "Image URL is not defined, but banner is, rendering will be cancelled",
      "ThankyouPage",
      "response:",
      responseData,
    );
    return undefined;
  }
  const position =
    rawBanner.position === "INLINE" ? "ABOVE_THE_LIST" : rawBanner.position;
  if (!position) {
    loggerError(
      "Position is not defined, but banner is, rendering will be cancelled",
      "ThankyouPage",
      "response:",
      responseData,
    );
  }
  return {
    bannerUrl,
    dataUsageText:
      "desktop" in dataUsageText
        ? dataUsageText[deviceContentKey]
        : dataUsageText,
    description:
      "desktop" in description ? description[deviceContentKey] : description,
    imageUrl,
    position: position || "ABOVE_THE_LIST",
    title,
    selectVoucherText,
  };
}

function parseCbResponseData(
  responseData: SovendusResponseRaw,
  personalData: PersonalData,
  deviceContentKey: "desktop" | "mobile",
): CheckoutBenefitsResponseParsed | undefined {
  const rawProducts = responseData?.list?.products;
  if (!rawProducts || !Array.isArray(rawProducts)) {
    return undefined;
  }

  const products: CheckoutBenefitsProductsResponseParsed[] = rawProducts.map(
    (product) => {
      const advantages: TextDataPart[] =
        product?.offerAdvantages?.[deviceContentKey]
          ?.split("\n")
          .map((text) => {
            const hasBoldMarkers = text.includes("**");
            // Clean the text by removing markdown syntax
            const cleanedText = hasBoldMarkers
              ? text.split("**").join("").replace("* ", "")
              : text.replace("* ", "");
            return {
              text: cleanedText,
              bold: hasBoldMarkers,
            };
          }) || [];
      const title = product.title;

      const imageUrl = product.imageUrl;
      const savings = product.savings;
      const buttonText = product.buttonText;
      const redirectUrl = addHashParams(
        product.redirectUrl || "",
        personalData,
      );
      return {
        title: title || "",
        imageUrl: imageUrl || "",
        offerAdvantages: advantages,
        savings,
        buttonText: buttonText || "",
        redirectUrl,
      } satisfies CheckoutBenefitsProductsResponseParsed;
    },
  );
  const imprint = responseData?.list?.imprint;
  if (!imprint) {
    loggerError(
      "Imprint is not defined, but products are, rendering will be cancelled",
      "ThankyouPage",
      "response:",
      responseData,
    );
  }
  const privacyPolicy = responseData?.list?.privacyPolicy;
  if (!privacyPolicy) {
    loggerError(
      "Privacy policy is not defined, but products are, rendering will be cancelled",
      "ThankyouPage",
      "response:",
      responseData,
    );
  }
  const poweredBy = responseData?.list?.poweredBy;
  if (!poweredBy) {
    loggerError(
      "Powered by is not defined, but products are, rendering will be cancelled",
      "ThankyouPage",
      "response:",
      responseData,
    );
  }
  const rendered = responseData?.list?.rendered;
  void callRenderedApi(rendered);
  return {
    products,
    imprint: imprint || { text: "", bold: false },
    privacyPolicy: privacyPolicy || { text: "", bold: false },
    poweredBy: poweredBy || "",
  };
}

function addHashParams(
  originalLink: string,
  personalData: PersonalData,
): string {
  const cleanUrl = originalLink.split("#")[0];
  const hashParams = new URLSearchParams();
  Object.entries(personalData).forEach(
    ([key, value]: [string, string | undefined]) => {
      if (value) {
        hashParams.append(key, value);
      }
    },
  );
  return `${cleanUrl}#${hashParams.toString()}`;
}

async function callRenderedApi(onRenderUrl: string | undefined): Promise<void> {
  if (!onRenderUrl) {
    return;
  }
  try {
    await fetch(onRenderUrl.toString(), {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // TODO ignore errors as its not critical
    loggerError("Failed to call rendered API", "ThankyouPage", error);
  }
}

function getDeviceType(
  responseDeviceType: DeviceType | undefined,
  localDeviceType: DeviceType | undefined,
): {
  deviceType: DeviceType;
  deviceContentKey: "desktop" | "mobile";
} {
  if (!responseDeviceType) {
    loggerError(
      "Device type is not defined, falling back to DESKTOP",
      "ThankyouPage",
    );
  }
  const deviceType: DeviceType =
    localDeviceType || responseDeviceType || "DESKTOP";
  const deviceContentKey =
    deviceType === "DESKTOP"
      ? "desktop"
      : deviceType === "MOBILE"
        ? "mobile"
        : "desktop";
  return { deviceType, deviceContentKey };
}

export type StoredVNFormDataElement = [
  string | undefined,
  string | undefined,
  boolean | undefined,
];

export type StoredVNFormData = {
  [key in VoucherNetworkCountryCode]?: StoredVNFormDataElement;
};

export type VoucherNetworkCountryCode =
  | "de-AT"
  | "fr-BE"
  | "nl-BE"
  | "da-DK"
  | "fr-FR"
  | "de-DE"
  | "en-IE"
  | "it-IT"
  | "nl-NL"
  | "nb-NO"
  | "pl-PL"
  | "es-ES"
  | "sv-SE"
  | "de-CH"
  | "fr-CH"
  | "it-CH"
  | "en-GB";

interface BannerRequestData {
  trafficSourceNumber: string;
  trafficMediumNumber: string;
  orderId?: string;
  orderValue?: string;
  orderCurrency?: string;
  usedCouponCode?: string;

  salutation?: "Mr." | "Mrs." | undefined;
  yearOfBirth?: number | string | undefined;
  zipCode?: string | undefined;
  consumerEmailHash?: string | undefined;
  country: CountryCodes | undefined;

  firstNameExists: boolean;
  lastNameExists: boolean;
  emailExists: boolean;
  cityExists: boolean;
  streetExists: boolean;
  streetNumberExists: boolean;
  dateOfBirthExists: boolean;

  sandbox?: boolean;
  withSetup:
    | "list,json,html"
    | "list,json"
    | "list,html"
    | "json,html"
    | "json"
    | "list";
}

/* PARSED RESPONSE */
export interface SovendusResponseParsed {
  banner: BannerResponseParsed | undefined;
  list: CheckoutBenefitsResponseParsed | undefined;
  background?: "base" | "subdued" | "transparent";
  deviceType?: DeviceType;
}

export interface BannerResponseParsed {
  title: string;
  description: TextData;
  imageUrl: string;
  selectVoucherText: string;
  bannerUrl: string;
  dataUsageText: TextData;
  position: "ABOVE_THE_LIST" | "BELOW_THE_LIST";
}

export interface CheckoutBenefitsResponseParsed {
  title?: string;
  products: CheckoutBenefitsProductsResponseParsed[];
  imprint: TextDataPart;
  poweredBy: string;
  privacyPolicy: TextDataPart;
  moreOffersLink?: string;
  moreOffersText?: string;
}

export interface CheckoutBenefitsProductsResponseParsed {
  title: string;
  imageUrl: string;
  offerAdvantages: TextDataPart[];
  savings: string;
  buttonText: string;
  redirectUrl: string;
}

type DeviceType = "DESKTOP" | "MOBILE" | "TABLET";

/* RAW RESPONSE */

export interface SovendusResponseRaw {
  banner?: BannerResponseRaw;
  list?: CheckoutBenefitsResponseRaw;
  deviceType?: DeviceType;
}

export type TextData = TextDataPart[];

export type TextDataPart = {
  text: string;
  bold?: boolean;
  url?: string;
};

export interface BannerResponseRaw {
  title?: string;
  description?: { desktop: TextData; mobile: TextData } | TextData;
  imageUrl?: string;
  selectVoucherText?: string;
  deviceType?: DeviceType;
  bannerUrl?: string;
  dataUsageText?: { desktop: TextData; mobile: TextData } | TextData;
  position?: "ABOVE_THE_LIST" | "BELOW_THE_LIST" | "INLINE";
}

export interface CheckoutBenefitsResponseRaw {
  products: CheckoutBenefitsProductsResponseRaw[];
  imprint: TextDataPart;
  poweredBy: string;
  privacyPolicy: TextDataPart;
  // urls has to be called on successful render
  rendered: string;
}

export interface CheckoutBenefitsProductsResponseRaw {
  title?: string;
  imageUrl?: string;
  offerAdvantages?: CheckoutBenefitsTextsResponseRaw;
  buttonText?: string;
  savings: string;
  redirectUrl?: string;
}

export interface CheckoutBenefitsTextsResponseRaw {
  // desktop: "* 0,- € annual fee\n* No account change necessary\n* **0 € foreign transaction fee**\n* Comprehensive travel insurance\n* **Your secure companion for the next trip**"
  mobile: string;
  // mobile: "0,- € annual fee"
  desktop: string;
}
