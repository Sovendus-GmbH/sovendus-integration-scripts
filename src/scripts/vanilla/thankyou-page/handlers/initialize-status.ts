import type { IntegrationData } from "sovendus-integration-types";

import { integrationScriptVersion } from "../../constants";
import type { SovendusThankyouPage } from "../thankyou-page-handler";

export function initializeStatus(this: SovendusThankyouPage): IntegrationData {
  const sovThankyouStatus: IntegrationData = {
    integrationScriptVersion,
    status: {
      sovThankyouConfigFound: false,
      integrationLoaderStarted: false,
      integrationParametersLoaded: false,
      checkoutProductsPixelFired: false,
      loadedOptimize: false,
      voucherNetworkCookieBasedVoucherFound: false,
      voucherNetworkCouponCodeSent: false,
      integrationLoaderVnCbStarted: false,
      integrationLoaderDone: false,
      voucherNetworkIframeContainerIdFound: false,
      voucherNetworkIframeContainerFound: false,
      countryCodePassedOnByPlugin: false,
    },
    data: {
      orderValue: undefined,
      orderCurrency: undefined,
      orderId: undefined,
      sovCouponCode: undefined,
      sovReqToken: undefined,
      puid: undefined,
      sovDebugLevel: undefined,
    },
    times: {
      integrationLoaderStart: this.getPerformanceTime(),
    },
  };
  return sovThankyouStatus;
}
