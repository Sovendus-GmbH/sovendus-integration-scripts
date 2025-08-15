import type {
  IntegrationData,
  SovendusThankYouPageConfig,
} from "sovendus-integration-types";

import { getOptimizeId } from "../../shared-utils";
import type { SovendusThankyouPage } from "../thankyou-page-handler";

export async function handleOptimizeConversion(
  this: SovendusThankyouPage,
  sovThankyouConfig: SovendusThankYouPageConfig,
  sovThankyouStatus: IntegrationData,
): Promise<void> {
  const optimizeId = getOptimizeId(
    sovThankyouConfig.settings,
    sovThankyouConfig.customerData.consumerCountry,
  );
  if (!optimizeId) {
    return;
  }
  // TODO handle multiple coupon codes
  const couponCode = sovThankyouConfig.orderData.usedCouponCodes?.[0];
  await this.handleOptimizeConversionScript(
    optimizeId,
    couponCode,
    sovThankyouConfig,
    sovThankyouStatus,
  );
}
