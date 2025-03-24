"use client";

import type { JSX } from "react";
import { useEffect, useMemo } from "react";
import type {
  SovendusPageConfig,
  SovendusPageData,
  SovendusPageWindow,
  SovPageStatus,
} from "sovendus-integration-types";

import { SovendusPage } from "../vanilla/landing-page/sovendus-page-handler";

export interface SovendusLandingPageReactScriptProps
  extends SovendusPageConfig {
  onDone?: (
    sovPageStatus: SovPageStatus,
    sovPageConfig: SovendusPageConfig,
  ) => void | Promise<void>;
}

export function SovendusLandingPageReact(
  props: SovendusLandingPageReactScriptProps,
): JSX.Element {
  return useMemo(() => {
    return <Handler {...props} />;
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function Handler({
  onDone,
  ...sovPageConfig
}: SovendusLandingPageReactScriptProps): JSX.Element {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (window.sovendusPageInitialized) {
      return;
    }
    window.sovendusPageInitialized = true;
    // this is done for the testing app
    window.sovPageConfig = sovPageConfig;
    const _onDone = ({ sovPageStatus }: SovendusPageData): void => {
      // this is done for the testing app
      window.sovPageStatus = sovPageStatus;
      void onDone?.(sovPageStatus, sovPageConfig);
    };
    const sovendusPage = new SovendusPage();
    void sovendusPage.main(sovPageConfig, _onDone);
    return (): void => {
      sovendusPage.unmount();
    };
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
}

interface _SovendusPageWindow extends SovendusPageWindow {
  sovendusPageInitialized?: boolean;
}

declare let window: _SovendusPageWindow;
