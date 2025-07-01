import type { JSX } from "react";

import type { BannerResponseParsed } from "./api";
import {
  BlockStack,
  Button,
  Divider,
  Heading,
  Image,
  InlineLayout,
  InlineStack,
  Link,
  Text,
} from "./components";

export function SovendusNativeBanner({
  bannerData,
}: {
  bannerData: BannerResponseParsed;
}): JSX.Element {
  return (
    <BlockStack
      padding="base"
      spacing="base"
      border="base"
      borderRadius="base"
      style={{ maxWidth: "600px", margin: "0 auto" }}
    >
      <Heading level={3} style={{ textAlign: "center", marginBottom: "16px" }}>
        {bannerData.title}
      </Heading>

      <InlineLayout
        columns={["80px", "1fr"]}
        spacing={["base", "base"]}
        blockAlignment={"start"}
        padding={"none"}
      >
        <Image
          source={bannerData.imageUrl}
          maxWidth="60px"
          maxHeight="60px"
          style={{ borderRadius: "8px" }}
        />
        <BlockStack spacing="base">
          <Text style={{ lineHeight: "1.4" }}>
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

          <CallToAction bannerData={bannerData} />
        </BlockStack>
      </InlineLayout>

      <Divider />

      <InlineStack
        padding={"base"}
        background="subdued"
        style={{ borderRadius: "4px" }}
      >
        <DataUsageText bannerData={bannerData} />
      </InlineStack>
    </BlockStack>
  );
}

function CallToAction({
  bannerData,
}: {
  bannerData: BannerResponseParsed;
}): JSX.Element {
  return (
    <Link external={true} to={bannerData.bannerUrl}>
      <Button>{bannerData.selectVoucherText}</Button>
    </Link>
  );
}

function DataUsageText({
  bannerData,
}: {
  bannerData: BannerResponseParsed;
}): JSX.Element {
  return (
    <Text size="extraSmall" emphasis="bold">
      {bannerData.dataUsageText?.map((textBlock, index) => {
        if (textBlock.url) {
          return (
            <Link key={index} to={textBlock.url} appearance="monochrome">
              {textBlock.text}
            </Link>
          );
        }
        return textBlock.text;
      })}
    </Text>
  );
}
