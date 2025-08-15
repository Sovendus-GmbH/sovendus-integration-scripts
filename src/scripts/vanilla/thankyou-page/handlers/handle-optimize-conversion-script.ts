import type {
  IntegrationData,
  SovendusThankYouPageConfig,
} from "sovendus-integration-types";

import type { SovendusThankyouPage } from "../thankyou-page-handler";

// Is async in case the plugin needs to wait for the script to load
export function handleOptimizeConversionScript(
  this: SovendusThankyouPage,
  optimizeId: string,
  couponCode: string | undefined,
  sovThankyouConfig: SovendusThankYouPageConfig,
  sovThankyouStatus: IntegrationData,
): Promise<void> | void {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.src = `https://www.sovopt.com/${optimizeId}/conversion/?ordervalue=${
    sovThankyouConfig.orderData.orderValue?.netOrderValue
  }&ordernumber=${sovThankyouConfig.orderData.orderId}&vouchercode=${
    couponCode
  }&email=${sovThankyouConfig.customerData.consumerEmail}`;
  document.head.appendChild(script);
  sovThankyouStatus.status.loadedOptimize = true;
}
