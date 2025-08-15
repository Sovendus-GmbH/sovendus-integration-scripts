import type {
  OrderValueData,
  SovendusThankYouPageConfig,
} from "sovendus-integration-types";

import { loggerError, makeNumber } from "../../shared-utils";
import type { SovendusThankyouPage } from "../thankyou-page-handler";

export function parseOrderValue(
  this: SovendusThankyouPage,
  sovThankyouConfig: SovendusThankYouPageConfig,
): void {
  const orderValueData = sovThankyouConfig.orderData.orderValue;
  if (!orderValueData) {
    return;
  }
  if (orderValueData.netOrderValue) {
    orderValueData.netOrderValue = makeNumber(orderValueData.netOrderValue);
  } else {
    orderValueData.netOrderValue = calculateNetValue(orderValueData);
  }
}

function calculateNetValue(orderValueData: OrderValueData): number | undefined {
  const grossOrderValue = makeNumber(orderValueData.grossOrderValue);
  if (typeof grossOrderValue === "undefined") {
    return undefined;
  } else {
    const shippingValue = makeNumber(orderValueData.shippingValue);
    if (typeof shippingValue === "undefined") {
      loggerError(
        "shippingValue is not defined in SovendusThankyouPage.calculateOrderValue",
        "ThankyouPage",
      );
    }
    const taxValue = calculateTaxValue(orderValueData, grossOrderValue);
    return Math.max(0, grossOrderValue - taxValue - (shippingValue || 0));
  }
}

function calculateTaxValue(
  orderValueData: OrderValueData,
  grossOrderValue: number,
): number {
  const taxValue = makeNumber(orderValueData.taxValue);
  if (typeof taxValue === "undefined") {
    const taxPercent = makeNumber(orderValueData.taxPercent);
    if (typeof taxPercent === "undefined") {
      loggerError(
        "Either taxPercent or taxValue has to be defined in SovendusThankyouPage.calculateOrderValue",
        "ThankyouPage",
      );
    } else {
      return (grossOrderValue / (1 + taxPercent / 100)) * (taxPercent / 100);
    }
  } else {
    return taxValue;
  }
  return 0;
}
