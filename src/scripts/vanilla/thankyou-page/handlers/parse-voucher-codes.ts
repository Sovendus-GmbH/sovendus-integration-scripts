import type {
  IntegrationData,
  SovendusThankYouPageConfig,
} from "sovendus-integration-types";

import type { SovendusThankyouPage } from "../thankyou-page-handler";

export async function parseVoucherCodes(
  this: SovendusThankyouPage,
  sovThankyouConfig: SovendusThankYouPageConfig,
  sovThankyouStatus: IntegrationData,
): Promise<void> {
  const couponCodes = new Set<string>(
    sovThankyouConfig.orderData.usedCouponCodes,
  );
  const couponFromCookie = await this.getCookie("sovCouponCode");
  if (couponFromCookie) {
    this.clearCookie("sovCouponCode");
    sovThankyouConfig.orderData.usedCouponCodes = [couponFromCookie];
    sovThankyouStatus.status.voucherNetworkCookieBasedVoucherFound = true;
    // if a cookie based coupon code is found, we stop here as we don't want to send the other coupon codes
    return;
  }
  if (sovThankyouConfig.orderData.usedCouponCode) {
    couponCodes.add(sovThankyouConfig.orderData.usedCouponCode);
  }
  sovThankyouConfig.orderData.usedCouponCodes = Array.from(couponCodes);
}
