import {
  defaultIframeContainerQuerySelector,
  type IframeContainerQuerySelectorSettings,
  type IntegrationData,
  type SovendusThankYouPageConfig,
  type VoucherNetworkLanguage,
} from "sovendus-integration-types";

import { loggerError } from "../../shared-utils";
import type { SovendusThankyouPage } from "../thankyou-page-handler";

export function handleSovendusVoucherNetworkDivContainer(
  this: SovendusThankyouPage,
  voucherNetworkConfig: VoucherNetworkLanguage,
  sovThankyouConfig: SovendusThankYouPageConfig,
  sovThankyouStatus: IntegrationData,
): string {
  const iframeContainerSettings = this.getIframeQuerySelector(
    voucherNetworkConfig,
    sovThankyouConfig,
  );
  const rootElement = document.querySelector(iframeContainerSettings.selector);
  if (rootElement) {
    if (iframeContainerSettings.where === "none") {
      // if where is none, we use the root element as the container
      sovThankyouStatus.status.voucherNetworkIframeContainerFound = true;
      if (!rootElement.id) {
        rootElement.id = "sovendus-container";
      }
      return rootElement.id;
    }
    // otherwise we create a new container
    const sovendusDiv = document.createElement("div");
    sovendusDiv.id = "sovendus-container";
    rootElement.insertAdjacentElement(
      iframeContainerSettings.where,
      sovendusDiv,
    );
    sovThankyouStatus.status.voucherNetworkIframeContainerFound = true;
    return sovendusDiv.id;
  } else {
    sovThankyouStatus.status.voucherNetworkIframeContainerFound = false;
    loggerError(
      `Voucher Network container query selector ${iframeContainerSettings.selector} not found`,
      "ThankyouPage",
    );
    return "";
  }
}

export function getIframeQuerySelector(
  this: SovendusThankyouPage,
  voucherNetworkConfig: VoucherNetworkLanguage,
  sovThankyouConfig: SovendusThankYouPageConfig,
): IframeContainerQuerySelectorSettings {
  if (voucherNetworkConfig.iframeContainerQuerySelector) {
    return voucherNetworkConfig.iframeContainerQuerySelector;
  }
  if (sovThankyouConfig.iframeContainerQuerySelector) {
    return sovThankyouConfig.iframeContainerQuerySelector;
  }
  loggerError(
    "No iframeContainerQuerySelector found in SovendusThankYouPageConfig, trying default",
    "ThankyouPage",
  );
  return defaultIframeContainerQuerySelector;
}
