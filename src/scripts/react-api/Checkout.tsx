import type { Dispatch, JSX, SetStateAction } from "react";
import { useEffect, useState } from "react";
import type { CountryCodes, LanguageCodes } from "sovendus-integration-types";

import type { SovendusResponseParsed } from "./api";
import { getBannerData } from "./api";
import CheckoutBenefits from "./CheckoutBenefits";
import CheckoutBenefitsVoucherNetworkCombo from "./CheckoutBenefitsVoucherNetworkCombo";
import { BlockStack } from "./components";
import { isFancyMode } from "./isFancyMode";
import { SovendusNativeBanner } from "./VoucherNetwork";

// Generic address interface to replace Shopify's MailingAddress
export interface Address {
  countryCode?: string;
  city?: string;
  zip?: string;
  street?: string;
  streetNumber?: string;
}

// Interface for order data that should be passed as props
export interface OrderData {
  orderConfirmationNumber: string;
  currency: string;
  grossAmount: number;
  taxAmount: number;
  shippingAmount: number;
  voucherCodes?: string[];
}

// Interface for customer data that should be passed as props
export interface CustomerData {
  email?: string | undefined;
  phone?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  address?: Address;
}

// Interface for localization data
export interface LocalizationData {
  language: string;
  country: string;
}

// Interface for Sovendus configuration
export interface SovendusConfig {
  trafficSourceNumber: string | undefined;
  trafficMediumNumber: string | undefined;
  isEnabled?: boolean;
}

// Main component that should be used by consumers
export function SovendusBanner({
  orderData,
  customerData,
  localization,
  config,
}: {
  orderData: OrderData;
  customerData?: CustomerData;
  localization: LocalizationData;
  config: SovendusConfig;
}): JSX.Element {
  const [bannerData, setBannerData] = useState<
    SovendusResponseParsed | undefined
  >();
  const [isFetching, setIsFetching] = useState(false);

  const {
    language: actualLanguage,
    country: actualCountry,
    addressData,
    email,
    phone,
  } = getLocale(localization.language, localization.country, customerData);

  const isEnabled = config.isEnabled !== false;
  const trafficSourceNumber = config.trafficSourceNumber;
  const trafficMediumNumber = config.trafficMediumNumber;

  const netOrderValue =
    orderData.grossAmount - orderData.taxAmount - orderData.shippingAmount;

  useEffect(() => {
    if (
      !isFetching &&
      isEnabled &&
      netOrderValue !== undefined &&
      trafficSourceNumber &&
      trafficMediumNumber &&
      actualCountry
    ) {
      setIsFetching(true);
      void getBannerData({
        setBannerData: setBannerData as Dispatch<
          SetStateAction<SovendusResponseParsed>
        >,
        trafficSourceNumber,
        trafficMediumNumber,
        orderConfirmationNumber: orderData.orderConfirmationNumber,
        netOrderValue,
        currency: orderData.currency,
        voucherCodes: orderData.voucherCodes || [],
        country: actualCountry,
        email: email || "",
        phone: phone || "",
        firstName: customerData?.firstName || "",
        lastName: customerData?.lastName || "",
        city: addressData?.city || "",
        zip: addressData?.zip || "",
      });
    }
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isEnabled,
    netOrderValue,
    trafficSourceNumber,
    trafficMediumNumber,
    actualCountry,
  ]);
  const hasData = bannerData?.banner || bannerData?.list;
  const isFancy = isFancyMode;
  if (!hasData) {
    return <></>;
  }
  function renderBanner(): JSX.Element | null {
    if (!actualLanguage || !actualCountry) {
      return null;
    }

    const languageCode = actualLanguage.toUpperCase() as LanguageCodes;

    if (bannerData?.banner && bannerData?.list) {
      return (
        <CheckoutBenefitsVoucherNetworkCombo
          bannerData={bannerData.banner}
          checkoutBenefits={bannerData.list}
          countryKey={actualCountry}
          languageKey={languageCode}
          isFancy={isFancy}
        />
      );
    }
    if (bannerData?.banner) {
      return <SovendusNativeBanner bannerData={bannerData.banner} />;
    }
    if (bannerData?.list) {
      return (
        <CheckoutBenefits
          countryKey={actualCountry}
          languageKey={languageCode}
          bannerData={bannerData.banner}
          checkoutBenefits={bannerData.list}
        />
      );
    }

    return null;
  }
  return hasData ? (
    <BlockStack
      border="base"
      padding="none"
      spacing={"none"}
      borderRadius="base"
      background="base"
    >
      {renderBanner()}
    </BlockStack>
  ) : (
    <></>
  );
}

function getLocale(
  localCode: string,
  country: string,
  customerData?: CustomerData,
): {
  language: string | undefined;
  country: CountryCodes | undefined;
  addressData: Address | undefined;
  email: string | undefined;
  phone: string | undefined;
} {
  const [language, countryFromLocale] = localCode?.split("-") || [];
  return {
    language,
    country: (customerData?.address?.countryCode ||
      country ||
      countryFromLocale) as CountryCodes | undefined,
    addressData: customerData?.address,
    email: customerData?.email,
    phone: customerData?.phone,
  };
}
