import type {
  IntegrationData,
  RedemptionApiRequestData,
  SovendusConversionsData,
} from "sovendus-integration-types";

import { loggerError } from "../../shared-utils";
import type { SovendusThankyouPage } from "../thankyou-page-handler";

export const couponRedemptionApi =
  "https://coupon-api.sovendus.com/redeem/sovendus-integration/";

export async function sendCouponCodes(
  this: SovendusThankyouPage,
  orderData: SovendusConversionsData,
  trafficSourceNumber: string,
  sovThankyouStatus: IntegrationData,
  skipFirstCouponCode: boolean,
): Promise<void> {
  const couponCodes = skipFirstCouponCode
    ? orderData.usedCouponCodes?.slice(1)
    : orderData.usedCouponCodes;

  if (couponCodes) {
    await Promise.all(
      couponCodes.map(async (coupon) => {
        await sendCouponCode(
          {
            trafficSourceNumber: trafficSourceNumber,
            couponCode: coupon,
            orderValue: orderData.orderValue?.netOrderValue
              ? Number(orderData.orderValue?.netOrderValue)
              : undefined,
            orderCurrency: orderData.orderCurrency,
            orderId: orderData.orderId,
            sessionId: orderData.sessionId,
          },
          sovThankyouStatus,
        );
      }),
    );
  }
}

async function sendCouponCode(
  redemptionData: RedemptionApiRequestData,
  sovThankyouStatus: IntegrationData,
): Promise<void> {
  const endpoint = `${couponRedemptionApi}${encodeURIComponent(
    btoa(JSON.stringify(redemptionData)),
  )}`;
  const response = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(redemptionData),
  });
  if (!response.ok) {
    sovThankyouStatus.status.voucherNetworkCouponCodeSent = false;
    loggerError("Error sending coupon code", "ThankyouPage", response);
  } else {
    sovThankyouStatus.status.voucherNetworkCouponCodeSent = true;
  }
}
