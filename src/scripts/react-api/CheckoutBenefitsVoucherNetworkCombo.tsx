import type { JSX } from "react";
import type { CountryCodes, LanguageCodes } from "sovendus-integration-types";

import type {
  BannerResponseParsed,
  CheckoutBenefitsResponseParsed,
} from "./api";
import CheckoutBenefits, {
  CheckoutBenefitsProductAdvantages,
} from "./CheckoutBenefits";
import {
  BlockStack,
  Button,
  Divider,
  Grid,
  Heading,
  Image,
  InlineLayout,
  Link,
  Tag,
  Text,
  View,
} from "./components";
import { getTranslation } from "./translations";

export default function CheckoutBenefitsVoucherNetworkCombo({
  checkoutBenefits,
  bannerData,
  countryKey,
  languageKey,
  isFancy,
}: {
  checkoutBenefits: CheckoutBenefitsResponseParsed;
  bannerData: BannerResponseParsed;
  countryKey: CountryCodes;
  languageKey: LanguageCodes | undefined;
  isFancy: boolean;
}): JSX.Element {
  const vnBanner = (
    <VoucherNetworkWithEnabledCB
      bannerData={bannerData}
      isFancy={isFancy}
      countryKey={countryKey}
      languageKey={languageKey}
    />
  );
  return (
    <CheckoutBenefits
      bannerData={bannerData}
      countryKey={countryKey}
      languageKey={languageKey}
      additionalOfferBegin={
        bannerData.position === "ABOVE_THE_LIST" ? (
          <>
            {vnBanner}
            <Divider />
          </>
        ) : (
          <></>
        )
      }
      additionalOfferEnd={
        bannerData.position === "BELOW_THE_LIST" ? (
          <>
            <Divider />
            {vnBanner}
          </>
        ) : (
          <></>
        )
      }
      checkoutBenefits={checkoutBenefits}
    />
  );
}

function VoucherNetworkWithEnabledCB({
  bannerData,
  isFancy,
  countryKey,
  languageKey,
}: {
  bannerData: BannerResponseParsed;
  countryKey: CountryCodes;
  languageKey: LanguageCodes | undefined;
  isFancy: boolean;
}): JSX.Element {
  const translations = getTranslation(countryKey, languageKey);

  return (
    <>
      <InlineLayout
        columns={[120, "fill"]}
        spacing={["base", "base"]}
        // blockAlignment="center"
      >
        <InlineLayout padding={"none"} spacing="none" columns={[97, "fill"]}>
          <Image source={bannerData.imageUrl} />
          <BlockStack padding="base"></BlockStack>
        </InlineLayout>
        <BlockStack padding={"base"} spacing={"tight"}>
          <Heading level={2}>
            {isFancy ? translations.vnFancyTitle : bannerData.title}
          </Heading>
          {isFancy ? (
            <>
              <Grid columns={["20%", "auto"]} rows={["auto"]} spacing="none">
                <View border="none" padding="none">
                  <Tag>{translations.offerAdvantageTag}</Tag>
                </View>
                <View border="none" padding="none"></View>
              </Grid>
              <BlockStack padding={"extraTight"} spacing="tight">
                <CheckoutBenefitsProductAdvantages
                  offerAdvantages={translations.offerAdvantages}
                />
              </BlockStack>
            </>
          ) : (
            <Text>
              {bannerData.description.map((textItem, index) =>
                textItem.bold ? (
                  <Text key={index} emphasis="bold">
                    {textItem.text}
                  </Text>
                ) : (
                  textItem.text
                ),
              )}
            </Text>
          )}
          <Link external={true} to={bannerData.bannerUrl}>
            <Button>{bannerData.selectVoucherText}</Button>
          </Link>
        </BlockStack>
      </InlineLayout>
    </>
  );
}
