"use client";

import type { JSX } from "react";
import { useEffect, useMemo } from "react";
import type {
  CountryCodes,
  IframeContainerQuerySelectorSettings,
  IntegrationData,
  LanguageCodes,
  SovendusConsumerData,
  SovendusConversionsData,
  SovendusPageUrlParams,
  SovendusThankYouPageConfig,
  SovendusThankyouPageData,
  SovendusThankyouWindow,
  VoucherNetworkLanguage,
} from "sovendus-integration-types";

import { loggerError } from "../vanilla";
import { getPerformanceTime } from "../vanilla/shared-utils";
import type { SovendusThankyouPage } from "../vanilla/thankyou-page/thankyou-page-handler";
import { cleanUp } from "../vanilla/thankyou-page/unmount";
import {
  getVoucherNetworkConfig,
  getVoucherNetworkCountryBasedSettings,
  handleCheckoutProductsConversion,
  handleCountryCode,
  handleOptimizeConversion,
  handleOrderValue,
  handleStreet,
  handleVoucherCode,
  initializeStatus,
  processConfig,
  sovendusThankyouMain,
  splitStreetAndStreetNumber,
} from "../vanilla/thankyou-page/utils";

export type SovendusThankYouPageReactConfig = Omit<
  SovendusThankYouPageConfig,
  "iframeContainerQuerySelector"
>;

export interface SovendusThankyouPageReactProps
  extends SovendusThankYouPageConfig {
  onDone?: (
    sovThankyouStatus: IntegrationData,
    sovThankyouConfig: SovendusThankYouPageReactConfig,
  ) => void | Promise<void>;
}

const getBackCookieName = "_gbs";

export function SovendusThankyouPageReact({
  onDone,
  ...sovThankyouConfig
}: SovendusThankyouPageReactProps): JSX.Element {
  const containerId = "sovendus-thankyou-container";
  const containerSelector = `#${containerId}`;
  const iframeContainerQuerySelector: IframeContainerQuerySelectorSettings = {
    selector: containerSelector,
    where: "none",
  };
  const config: SovendusThankYouPageConfig = {
    ...sovThankyouConfig,
    iframeContainerQuerySelector,
  };
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (
      window.sovendusThankyouPageInitialized &&
      Date.now() - window.sovendusThankyouPageInitialized < 1000
    ) {
      // debounce for dev env
      return;
    }
    window.sovendusThankyouPageInitialized = Date.now();
    // used for debugging with the testing app
    window.sovThankyouConfig = config;
    const _onDone = ({ sovThankyouStatus }: SovendusThankyouPageData): void => {
      // used for debugging with the testing app
      window.sovThankyouStatus = sovThankyouStatus;
      void onDone?.(sovThankyouStatus, config);
    };

    const sovendusPage = new SovendusThankyouPageReactNative();
    void sovendusPage.main(config, _onDone);
    return (): void => {
      if (
        window.sovendusThankyouPageInitialized &&
        Date.now() - window.sovendusThankyouPageInitialized < 1000
      ) {
        // debounce for dev env
        return;
      }
      sovendusPage.unmount();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(() => <div id={containerId} />, []);
}

class SovendusThankyouPageReactNative implements SovendusThankyouPage {
  main: (
    sovThankyouConfig: SovendusThankYouPageConfig,
    onDone: ({
      sovThankyouConfig,
      sovThankyouStatus,
    }: SovendusThankyouPageData) => void,
  ) => Promise<void> = sovendusThankyouMain;

  processConfig: (
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ) => Promise<void> = processConfig;

  handleCountryCode: (
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ) => void = handleCountryCode;

  handleOptimizeConversion: (
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ) => Promise<void> = handleOptimizeConversion;

  async handleOptimizeConversionScript(
    optimizeId: string,
    couponCode: string | undefined,
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ): Promise<void> {
    const eventdata = [
      [
        "event",
        "purchase",
        {
          order: {
            id: sovThankyouConfig.orderData.orderId,
            revenue: sovThankyouConfig.orderData.orderValue,
            email: sovThankyouConfig.customerData.consumerEmail,
            vouchercode: couponCode,
          },
        },
      ],
    ];
    const cookie = await this.getCookie(getBackCookieName);
    if (!cookie) {
      loggerError(
        "Optimize conversion failed due to missing getback cookie",
        "ThankyouPage",
      );
      sovThankyouStatus.status.loadedOptimize = false;

      return;
    }
    const parsedCookie = JSON.parse(cookie) as { [key: string]: string };
    await fetch(`https://www.sovopt.com/${optimizeId}/send/`, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: `uuid=${parsedCookie[optimizeId]}&data=${encodeURIComponent(
        JSON.stringify(eventdata),
      )}`,
    });
    sovThankyouStatus.status.loadedOptimize = false;
  }

  handleStreet: (sovThankyouConfig: SovendusThankYouPageConfig) => void =
    handleStreet;

  splitStreetAndStreetNumber: (street: string) => [string, string] =
    splitStreetAndStreetNumber;

  handleVoucherCode: (
    sovThankyouConfig: SovendusThankYouPageConfig,
  ) => Promise<void> = handleVoucherCode;

  initializeStatus: () => IntegrationData = initializeStatus;

  handleVoucherNetwork(
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ): void {
    const voucherNetworkConfig =
      this.getVoucherNetworkConfig(sovThankyouConfig);
    // TODO handle multiple coupon codes
    const couponCode = sovThankyouConfig.orderData.usedCouponCodes?.[0];
    if (
      voucherNetworkConfig?.trafficSourceNumber &&
      voucherNetworkConfig?.trafficMediumNumber &&
      voucherNetworkConfig?.isEnabled
    ) {
      const bannerData = await getBannerData({
        trafficSourceNumber: voucherNetworkConfig.trafficSourceNumber,
        trafficMediumNumber: voucherNetworkConfig.trafficMediumNumber,
        orderData: sovThankyouConfig.orderData,
        customerData: sovThankyouConfig.customerData,
      });
      sovThankyouStatus.status.integrationLoaderVnCbStarted = true;
      sovThankyouStatus.times.integrationLoaderVnCbStart =
        this.getPerformanceTime();
    }
  }

  handleOrderValue: (sovThankyouConfig: SovendusThankYouPageConfig) => void =
    handleOrderValue;

  handleSovendusVoucherNetworkDivContainer(): string {
    throw new Error("Shouldnt be called in React Native");
  }

  getIframeQuerySelector(): IframeContainerQuerySelectorSettings {
    throw new Error("Shouldnt be called in React Native");
  }

  handleCheckoutProductsConversion: (
    sovThankyouConfig: SovendusThankYouPageConfig,
    sovThankyouStatus: IntegrationData,
  ) => Promise<boolean> = handleCheckoutProductsConversion;

  // make it async as some platforms might need to wait for the cookies
  getCookie(
    name: keyof SovendusPageUrlParams | "_gbs",
  ): Promise<string | undefined> | string | undefined {
    throwErrorInNonBrowserContext({
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
    throwErrorInNonBrowserContext({
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

  getVoucherNetworkConfig: (
    sovThankyouConfig: SovendusThankYouPageConfig,
  ) => VoucherNetworkLanguage | undefined = getVoucherNetworkConfig;

  getVoucherNetworkCountryBasedSettings: (
    sovThankyouConfig: SovendusThankYouPageConfig,
  ) => VoucherNetworkLanguage | undefined =
    getVoucherNetworkCountryBasedSettings;

  detectLanguageCode(): LanguageCodes {
    throw new Error("Shouldn't be called in React Native");
  }

  getPerformanceTime: () => number = getPerformanceTime;

  detectCountryCode(): CountryCodes | undefined {
    throw new Error("Shouldn't be called in React Native");
  }

  unmount(): void {
    cleanUp();
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VnCbTestingUrl = "https://benefits-api.testing6.sovendus.com/v2/list";
const VnCbProductionUrl = "https://benefits-api.sovendus.com/v2/list";

export async function getBannerData({
  trafficSourceNumber,
  trafficMediumNumber,
  orderData,
  customerData,
}: {
  trafficSourceNumber: string;
  trafficMediumNumber: string;
  orderData: SovendusConversionsData;
  customerData: SovendusConsumerData;
}): Promise<SovendusResponseParsed | undefined> {
  const personalData: PersonalData = {
    firstName: customerData.consumerFirstName,
    lastName: customerData.consumerLastName,
    city: customerData.consumerCity,
    email: customerData.consumerEmail,
    phone: customerData.consumerPhone,
    dateOfBirth: customerData.consumerDateOfBirth,
    street: customerData.consumerStreet,
    streetNumber: customerData.consumerStreetNumber,
    salutation: customerData.consumerSalutation,
    yearOfBirth: customerData.consumerYearOfBirth,
    zipCode: customerData.consumerZipcode,
  };
  const body: BannerRequestData = {
    trafficSourceNumber,
    trafficMediumNumber,
    orderId: orderData.orderId,
    orderValue: orderData.orderValue?.netOrderValue,
    orderCurrency: orderData.orderCurrency,
    usedCouponCode: orderData.usedCouponCode,
    country: customerData.consumerCountry as CountryCodes | undefined,
    withSetup: "list,json,html",
    salutation: personalData.salutation,
    yearOfBirth: personalData.yearOfBirth,
    zipCode: customerData.consumerZipcode,
    consumerEmailHash: md5(personalData.email),

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
    const response = await fetch(VnCbProductionUrl, {
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
        console.log(
          "Sovendus app (VN/CB) - was executed successful, parse:",
          parsedData,
          "unparsed",
          responseJSON,
        );
        return parsedData;
      } else {
        console.error("Sovendus app (VN/CB) - failed to get banner data");
      }
    } else {
      console.log(
        "Sovendus App (VN/CB) - It seems like no Traffic Source Number is set.",
      );
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(
      "Sovendus App (CB) - Failed to get sovendus response data error: ",
      error,
    );
  }
  return undefined;
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
  yearOfBirth: string | number | undefined;
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
    deviceType: responseData.deviceType,
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
  const rawBannerUrl = rawBanner.bannerUrl;
  if (!rawBannerUrl) {
    loggerError(
      "Banner URL is not defined, but banner is, rendering will be cancelled",
      "ThankyouPage",
      "response:",
      responseData,
    );
    return undefined;
  }
  const bannerUrl = addHashParams(rawBannerUrl, personalData);
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
      "Position is not defined, but banner is, rendering will be continued",
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
      const advantages: TextDataPart[] = product?.offerAdvantages?.[
        deviceContentKey
      ]
        .split("\n")
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
        });
      const title = product.title;

      const imageUrl = product.imageUrl;
      const savings = product.savings;
      const buttonText = product.buttonText;
      const redirectUrl = addHashParams(product.redirectUrl, personalData);
      return {
        title,
        imageUrl,
        offerAdvantages: advantages,
        savings,
        buttonText,
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
    imprint,
    privacyPolicy,
    poweredBy,
  };
}

function addHashParams(
  originalLink: string,
  personalData: PersonalData,
): string {
  // we add the customer data only on the client to avoid sending it to the server
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
  orderId?: string | undefined;
  orderValue?: string | number | undefined;
  orderCurrency?: string | undefined;
  usedCouponCode?: string | undefined;

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
  withSetup: "list,json,html" | "list,json" | "list,html" | "json,html";
}

/* PARSED RESPONSE */
export interface SovendusResponseParsed {
  banner?: BannerResponseParsed;
  list?: CheckoutBenefitsResponseParsed;
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
  // desktop: "* 0,- € Jahresgebühr\n* Kein Kontowechsel notwendig\n* **0 € Auslandseinsatzgebühr**\n* Umfassende Reiseversicherung\n* **Ihr sicherer Begleiter für die nächste Reise**"
  mobile: string;
  // mobile: "0,- € Jahresgebühr"
  desktop: string;
}

interface _SovendusThankyouWindow extends SovendusThankyouWindow {
  sovendusThankyouPageInitialized?: number;
}

declare const window: _SovendusThankyouWindow;
