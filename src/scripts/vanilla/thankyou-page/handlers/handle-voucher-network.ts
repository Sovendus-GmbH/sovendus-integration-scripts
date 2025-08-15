import type {
  IntegrationData,
  SovendusConsumerData,
  SovendusThankYouPageConfig,
  SovendusVNConversion,
} from "sovendus-integration-types";

import type { SovendusThankyouPage } from "../thankyou-page-handler";
import { flexibleIframeScriptId } from "./constants";

export async function handleVoucherNetwork(
  this: SovendusThankyouPage,
  sovThankyouConfig: SovendusThankYouPageConfig,
  sovThankyouStatus: IntegrationData,
): Promise<void> {
  const voucherNetworkConfig = this.getVoucherNetworkConfig(sovThankyouConfig);
  if (
    voucherNetworkConfig?.trafficSourceNumber &&
    voucherNetworkConfig?.trafficMediumNumber &&
    voucherNetworkConfig?.isEnabled
  ) {
    const iframeContainerId = this.handleSovendusVoucherNetworkDivContainer(
      voucherNetworkConfig,
      sovThankyouConfig,
      sovThankyouStatus,
    );
    window.sovIframes = window.sovIframes || [];
    window.sovIframes.push({
      trafficSourceNumber: voucherNetworkConfig.trafficSourceNumber,
      trafficMediumNumber: voucherNetworkConfig.trafficMediumNumber,
      sessionId: sovThankyouConfig.orderData.sessionId,
      orderId: sovThankyouConfig.orderData.orderId,
      orderValue: sovThankyouConfig.orderData.orderValue?.netOrderValue,
      orderCurrency: sovThankyouConfig.orderData.orderCurrency,

      // Transmit first Coupon Code here and handle all other Coupon Codes in this.sendCouponCodes()
      usedCouponCode: sovThankyouConfig.orderData.usedCouponCodes?.[0],

      iframeContainerId: iframeContainerId,
      integrationType: sovThankyouConfig.integrationType,
    });
    window.sovConsumer = {
      consumerFirstName: sovThankyouConfig.customerData.consumerFirstName,
      consumerLastName: sovThankyouConfig.customerData.consumerLastName,
      consumerEmail: sovThankyouConfig.customerData.consumerEmail,
      consumerStreet: sovThankyouConfig.customerData.consumerStreet,
      consumerStreetNumber: sovThankyouConfig.customerData.consumerStreetNumber,
      consumerZipcode: sovThankyouConfig.customerData.consumerZipcode,
      consumerCity: sovThankyouConfig.customerData.consumerCity,
      consumerCountry: sovThankyouConfig.customerData.consumerCountry,
      consumerPhone: sovThankyouConfig.customerData.consumerPhone,
      consumerDateOfBirth: sovThankyouConfig.customerData.consumerDateOfBirth,
      consumerYearOfBirth: sovThankyouConfig.customerData.consumerYearOfBirth,
      consumerEmailHash: sovThankyouConfig.customerData.consumerEmailHash,
      consumerSalutation: sovThankyouConfig.customerData.consumerSalutation,
      consumerStreetWithNumber:
        sovThankyouConfig.customerData.consumerStreetWithNumber,
      consumerLanguage: sovThankyouConfig.customerData.consumerLanguage,
    };

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.id = flexibleIframeScriptId;
    script.src = "https://api.sovendus.com/sovabo/common/js/flexibleIframe.js";
    document.head.appendChild(script);

    sovThankyouStatus.status.integrationLoaderVnCbStarted = true;
    sovThankyouStatus.times.integrationLoaderVnCbStart =
      this.getPerformanceTime();
    await this.sendCouponCodes(
      sovThankyouConfig.orderData,
      voucherNetworkConfig.trafficSourceNumber,
      sovThankyouStatus,
      true,
    );
  }
}

interface ThankYouWindow extends Window {
  sovIframes: SovendusVNConversion[];
  sovConsumer: SovendusConsumerData;
}
declare let window: ThankYouWindow;
