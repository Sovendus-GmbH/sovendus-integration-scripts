"use client";

import type { ReactElement } from "react";
import { useEffect, useMemo } from "react";
import type {
  IframeContainerQuerySelectorSettings,
  IntegrationData,
  SovendusThankYouPageConfig,
  SovendusThankyouPageData,
  SovendusThankyouWindow,
} from "sovendus-integration-types";

import { SovendusThankyouPage } from "../vanilla/thankyou-page/thankyou-page-handler";

export interface SovendusThankyouPageReactProps
  extends Omit<SovendusThankYouPageConfig, "iframeContainerQuerySelector"> {
  onDone?: (
    sovThankyouStatus: IntegrationData,
    sovThankyouConfig: SovendusThankYouPageConfig,
  ) => void | Promise<void>;
}

const sovendusPage = new SovendusThankyouPage();

export function SovendusThankyouPageReact({
  onDone,
  ...sovThankyouConfig
}: SovendusThankyouPageReactProps): ReactElement {
  const containerId = "sovendus-thankyou-container";
  const containerSelector = `#${containerId}`;
  const iframeContainerQuerySelector: IframeContainerQuerySelectorSettings = {
    selector: containerSelector,
    where: "none",
  };
  const config: SovendusThankYouPageConfig = {
    ...sovThankyouConfig,
    iframeContainerQuerySelector,
  };
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (
      window.sovendusThankyouPageInitialized &&
      Date.now() - window.sovendusThankyouPageInitialized < 1000
    ) {
      // debounce for dev env
      return unmount;
    }
    window.sovendusThankyouPageInitialized = Date.now();
    // used for debugging with the testing app
    window.sovThankyouConfig = config;
    const _onDone = ({ sovThankyouStatus }: SovendusThankyouPageData): void => {
      // used for debugging with the testing app
      window.sovThankyouStatus = sovThankyouStatus;
      void onDone?.(sovThankyouStatus, config);
    };

    void sovendusPage.main(config, _onDone);
    return unmount;
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(() => <div id={containerId} />, []);
}

function unmount(): void {
  if (
    window.sovendusThankyouPageInitialized &&
    Date.now() - window.sovendusThankyouPageInitialized < 1000
  ) {
    // debounce for dev env
    return;
  }
  sovendusPage.unmount();
}

interface _SovendusThankyouWindow extends SovendusThankyouWindow {
  sovendusThankyouPageInitialized?: number;
}

declare const window: _SovendusThankyouWindow;
