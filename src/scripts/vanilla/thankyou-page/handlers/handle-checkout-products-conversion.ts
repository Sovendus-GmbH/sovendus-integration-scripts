import type {
  IntegrationData,
  SovendusThankYouPageConfig,
} from "sovendus-integration-types";

import type { SovendusThankyouPage } from "../thankyou-page-handler";

export async function handleCheckoutProductsConversion(
  this: SovendusThankyouPage,
  sovThankyouConfig: SovendusThankYouPageConfig,
  sovThankyouStatus: IntegrationData,
): Promise<boolean> {
  const { checkoutProducts } = sovThankyouConfig.settings;
  if (checkoutProducts) {
    const sovReqToken = await this.getCookie("sovReqToken");
    if (sovReqToken) {
      const pixelUrl = `https://press-order-api.sovendus.com/ext/image?sovReqToken=${decodeURIComponent(sovReqToken)}`;
      await fetch(pixelUrl);
      this.clearCookie("sovReqToken");
      sovThankyouStatus.status.checkoutProductsPixelFired = true;
    }
  }
  return false;
}
