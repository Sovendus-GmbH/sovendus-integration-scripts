"use client";

import type { ReactElement } from "react";
import { useEffect, useMemo } from "react";
import type {
  SovendusPageConfig,
  SovendusPageData,
  SovendusPageWindow,
  SovPageStatus,
} from "sovendus-integration-types";

import { SovendusPage } from "../vanilla/landing-page/sovendus-page-handler";

export interface SovendusLandingPageReactProps extends SovendusPageConfig {
  onDone?: (
    sovPageStatus: SovPageStatus,
    sovPageConfig: SovendusPageConfig,
  ) => void | Promise<void>;
}

export function SovendusLandingPageReact(
  props: SovendusLandingPageReactProps,
): ReactElement {
  return useMemo(() => {
    return <Handler {...props} />;
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

const sovendusPage = new SovendusPage();

function Handler({
  onDone,
  ...sovPageConfig
}: SovendusLandingPageReactProps): ReactElement {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (
      window.sovendusPageInitialized &&
      Date.now() - window.sovendusPageInitialized < 1000
    ) {
      // debounce for dev env
      return unmount;
    }
    window.sovendusPageInitialized = Date.now();
    // this is done for the testing app
    window.sovPageConfig = sovPageConfig;
    const _onDone = ({ sovPageStatus }: SovendusPageData): void => {
      // this is done for the testing app
      window.sovPageStatus = sovPageStatus;
      void onDone?.(sovPageStatus, window.sovPageConfig);
    };
    void sovendusPage.main(window.sovPageConfig, _onDone);
    return unmount;
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
}

function unmount(): void {
  if (
    window.sovendusPageInitialized &&
    Date.now() - window.sovendusPageInitialized < 1000
  ) {
    // debounce for dev env
    return;
  }
  sovendusPage.unmount();
}

interface _SovendusPageWindow extends SovendusPageWindow {
  sovendusPageInitialized?: number;
}

declare let window: _SovendusPageWindow;
