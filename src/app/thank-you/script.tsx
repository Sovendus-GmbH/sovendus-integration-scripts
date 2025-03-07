"use client";

import type { JSX } from "react";
import { useEffect } from "react";
import { getSettings } from "sovendus-integration-settings-ui/demo";
import type {
  SovendusThankyouPageData,
  SovendusThankyouWindow,
} from "sovendus-integration-types";
import type {
  SovendusConsumerData,
  SovendusConversionsData,
} from "sovendus-integration-types/src";

import { SovendusThankyouPage } from "../../scripts/thankyou-page/thankyou-page-handler";

export function SovendusThankyouPageDemoScript({
  config,
  containerId,
}: {
  config: {
    orderData: SovendusConversionsData;
    customerData: SovendusConsumerData;
  };
  containerId: string;
}): JSX.Element {
  useEffect(() => {
    window.sovThankyouConfig = {
      settings: getSettings(),
      integrationType: "sovendus-integration-scripts-preview",
      sovDebugLevel: "debug",
      iframeContainerId: containerId,
      orderData: config.orderData,
      customerData: config.customerData,
    };
    const OnDone = ({
      sovThankyouStatus,
    }: Partial<SovendusThankyouPageData>): void => {
      // used for debugging with the testing app
      if (sovThankyouStatus) {
        window.sovThankyouStatus = sovThankyouStatus;
        // eslint-disable-next-line no-console
        console.log("Page done: ", {
          sovThankyouStatus,
          sovPageConfig: window.sovThankyouConfig,
        });
      }
    };

    const sovendusPage = new SovendusThankyouPage();
    void sovendusPage.main(window.sovThankyouConfig, OnDone);
    return (): void => {
      sovendusPage.unmount();
    };
  }, [config.customerData, config.orderData, containerId]);
  return <></>;
}

declare const window: SovendusThankyouWindow;
