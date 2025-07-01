import type { ReactNode } from "react";
import type { JSX } from "react";
import type { CountryCodes, LanguageCodes } from "sovendus-integration-types";

import type {
  BannerResponseParsed,
  CheckoutBenefitsProductsResponseParsed,
  CheckoutBenefitsResponseParsed,
  TextDataPart,
} from "./api";
import {
  BlockStack,
  Button,
  Divider,
  Grid,
  Heading,
  Image,
  InlineLayout,
  InlineStack,
  Link,
  Tag,
  Text,
  View,
} from "./components";
import { getTranslation } from "./translations";

export default function CheckoutBenefits({
  checkoutBenefits,
  bannerData,
  countryKey,
  languageKey,
  additionalOfferBegin,
  additionalOfferEnd,
}: {
  checkoutBenefits: CheckoutBenefitsResponseParsed;
  bannerData: BannerResponseParsed | undefined;
  countryKey: CountryCodes;
  languageKey: LanguageCodes | undefined;
  additionalOfferBegin?: JSX.Element;
  additionalOfferEnd?: JSX.Element;
}): ReactNode {
  const translations = getTranslation(countryKey, languageKey);
  return (
    <BlockStack
      padding={"base"}
      spacing="base"
      border="base"
      borderRadius="base"
      style={{ maxWidth: "600px", margin: "0 auto" }}
    >
      <BlockStack padding={"none"} spacing={"base"}>
        <Heading level={3} style={{ textAlign: "center", marginBottom: "8px" }}>
          {checkoutBenefits.title || translations.title}
        </Heading>
        {additionalOfferBegin ? additionalOfferBegin : <></>}
        {checkoutBenefits.products.map((product, index) => (
          <CheckoutBenefitsOffer
            key={index}
            product={product}
            isLastOffer={index + 1 === checkoutBenefits.products.length}
          />
        ))}
        {additionalOfferEnd ? additionalOfferEnd : <></>}
        {bannerData?.bannerUrl ? (
          <>
            <Divider alignment="start" />
            <BlockStack padding="base" inlineAlignment="center">
              <Link external to={bannerData?.bannerUrl}>
                <Heading level={2}>{translations.moreOffersButtonText}</Heading>
              </Link>
            </BlockStack>
          </>
        ) : (
          <></>
        )}
      </BlockStack>

      <Divider alignment="end" />
      <Grid
        columns={[300, "fill", "auto"]}
        rows={["auto"]}
        spacing="loose"
        background={"subdued"}
      >
        <View border="none" padding="base">
          <InlineStack spacing="loose">
            <Link
              external={true}
              to={checkoutBenefits.privacyPolicy.url || "#"}
              appearance="monochrome"
            >
              {checkoutBenefits.privacyPolicy.text}
            </Link>
            <Link
              external={true}
              to={checkoutBenefits.imprint.url || "#"}
              appearance="monochrome"
            >
              {checkoutBenefits.imprint.text}
            </Link>
            <Text appearance="subdued">·</Text>
          </InlineStack>{" "}
        </View>
        <View border="none" padding="base"></View>
        <View border="none" padding="base">
          <Text appearance="subdued">{checkoutBenefits.poweredBy}</Text>
        </View>
      </Grid>
    </BlockStack>
  );
}
export function CheckoutBenefitsOffer({
  product,
  isLastOffer,
}: {
  product: CheckoutBenefitsProductsResponseParsed;
  isLastOffer: boolean;
}): ReactNode {
  return (
    <>
      <InlineLayout
        columns={["80px", "1fr"]}
        spacing={["none", "base"]}
        blockAlignment="start"
      >
        <InlineStack padding="none" spacing={"base"} inlineAlignment={"start"}>
          <Image
            source={product.imageUrl}
            maxWidth="60px"
            maxHeight="60px"
            style={{ borderRadius: "4px" }}
          />
        </InlineStack>
        <BlockStack padding={"base"} spacing="tight">
          <Heading level={2}>{product.title}</Heading>
          <Grid columns={["20%", "auto"]} rows={["auto"]} spacing="none">
            <View border="none" padding="none">
              <Tag>{product.savings}</Tag>
            </View>
            <View border="none" padding="none"></View>
          </Grid>

          <BlockStack padding={"extraTight"} spacing="tight">
            <CheckoutBenefitsProductAdvantages
              offerAdvantages={product.offerAdvantages}
            />
          </BlockStack>
          <Link external={true} to={product.redirectUrl}>
            <Button>{product.buttonText}</Button>
          </Link>
        </BlockStack>
      </InlineLayout>
      {isLastOffer ? <></> : <Divider />}
    </>
  );
}

export function CheckoutBenefitsProductAdvantages({
  offerAdvantages,
}: {
  offerAdvantages: TextDataPart[];
}): JSX.Element[] {
  return offerAdvantages.map((line, index) => {
    return (
      <Text key={index} emphasis={line.bold ? "bold" : undefined}>
        ✓ {line.text}
      </Text>
    );
    // return (
    //   <ListItem key={index}>
    //     <Text emphasis={line.bold ? "bold" : undefined}>{line.text}</Text>
    //   </ListItem>
    // );
  });
}

// CheckMark component removed due to lint issues with SVG data URL
