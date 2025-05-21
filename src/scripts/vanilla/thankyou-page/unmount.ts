import type {
  AwinConversion,
  IntegrationData,
  SovCbVnApplicationType,
  SovendusConsumerData,
  SovendusThankYouPageConfig,
  SovendusVNConversion,
} from "sovendus-integration-types";
import { sovLoaderScriptId } from "sovendus-integration-types";

import { flexibleIframeScriptId } from "./utils";

export function cleanUp(): void {
  window.sovApplication?.instances?.forEach((instance) => {
    if (instance.isCollapsableOverlay) {
      window.sovApplication?.collapsableOverlay?.closeInstance(instance, false);
      window.sovApplication?.sovCollector?.clearProperties();
    }
    if (instance.isStickyBanner) {
      window.sovApplication?.stickyBanner?.closeInstance(instance);
      window.sovApplication?.sovCollector?.clearProperties();
    }
  });
  if (window.sovApplication?.messageListener) {
    window.removeEventListener(
      "message",
      window.sovApplication?.messageListener,
      true,
    );
    window.sovApplication.resizeListenerAdded = false;
  }
  if (window.sovThankyouConfig) {
    delete window.sovThankyouConfig;
  }
  if (window.sovThankyouStatus) {
    delete window.sovThankyouStatus;
  }
  if (window.sovConsumer) {
    delete window.sovConsumer;
  }
  if (window.sovIframes) {
    delete window.sovIframes;
  }
  if (window.sovApplication) {
    delete window.sovApplication;
  }
  document.getElementById(sovLoaderScriptId)?.remove();
  document.getElementById(flexibleIframeScriptId)?.remove();
}

interface _SovendusPublicConversionWindow extends Window {
  sovThankyouConfig?: SovendusThankYouPageConfig;
  sovThankyouStatus?: IntegrationData;
  sovIframes?: SovendusVNConversion[];
  sovConsumer?: SovendusConsumerData;
  AWIN?: AwinConversion;
  sovApplication?: SovCbVnApplicationType;
}

declare let window: _SovendusPublicConversionWindow;
