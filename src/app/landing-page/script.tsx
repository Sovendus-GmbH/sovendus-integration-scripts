"use client";

import type { JSX } from "react";
import { useEffect } from "react";
import { getSettings } from "sovendus-integration-settings-ui/demo";
import type {
  SovendusPageData,
  SovendusPageWindow,
} from "sovendus-integration-types";

import { SovendusPage } from "../../landing-page/sovendus-page-handler";

export default function SovendusLandingPageDemoScript(): JSX.Element {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.sovPageConfig = {
      settings: getSettings(),
      integrationType: "sovendus-integration-scripts-preview",
      country: undefined,
    };
    // eslint-disable-next-line no-console
    console.log("started page with sovPageConfig", window.sovPageConfig);
    const OnDone = ({ sovPageStatus }: Partial<SovendusPageData>): void => {
      // used for debugging with the testing app
      if (sovPageStatus) {
        // eslint-disable-next-line no-console
        console.log("Page done: ", {
          sovPageStatus,
          sovPageConfig: window.sovPageConfig,
        });
        window.sovPageStatus = sovPageStatus;
      }
    };
    const sovendusPage = new SovendusPage();
    void sovendusPage.main(window.sovPageConfig, OnDone);
    return (): void => {
      sovendusPage.unmount();
    };
  }, []);
  return <></>;
}

declare let window: SovendusPageWindow;
