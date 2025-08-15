export {
  castToCountry,
  detectCountryCode,
  getCountryCodeFromHtmlTag,
  getCountryFromDomain,
  getCountryFromPagePath,
  getOptimizeId,
  getPerformanceTime,
  loggerError,
  loggerInfo,
  makeNumber,
  makeString,
} from "../../shared-utils";
export { clearCookie } from "./clear-cookie";
export { detectLanguageCode } from "./detect-language-code";
export { getCookie } from "./get-cookie";
export { getVoucherNetworkConfig } from "./get-voucher-network-config";
export { getVoucherNetworkCountryBasedSettings } from "./get-voucher-network-country-based-settings";
export { handleCheckoutProductsConversion } from "./handle-checkout-products-conversion";
export { handleCountryCode } from "./handle-country-code";
export { handleOptimizeConversion } from "./handle-optimize-conversion";
export { handleOptimizeConversionScript } from "./handle-optimize-conversion-script";
export { handleSovendusVoucherNetworkDivContainer } from "./handle-sovendus-voucher-network-div-container";
export { getIframeQuerySelector } from "./handle-sovendus-voucher-network-div-container";
export { handleVoucherNetwork } from "./handle-voucher-network";
export { initializeStatus } from "./initialize-status";
export { parseOrderValue } from "./parse-order-value";
export { parseStreet } from "./parse-street";
export { parseVoucherCodes } from "./parse-voucher-codes";
export { processConfig } from "./process-config";
export { sendCouponCodes } from "./send-coupon-codes";
export { sovendusThankyouMain } from "./sovendus-thankyou-main";
export { splitStreetAndStreetNumber } from "./split-street-and-street-number";
export { unmountThankYou } from "./unmount";

// Constants
export { flexibleIframeScriptId } from "./constants";
