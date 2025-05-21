import type {
  SovendusPageConfig,
  SovPageStatus,
} from "sovendus-integration-types";

import { loggerError } from "../shared-utils";
import type { SovendusPage } from "./sovendus-page-handler";

export function unmount(this: SovendusPage): void {
  try {
    const optimizeScript = document.getElementById(this.optimizeScriptId);
    if (optimizeScript) {
      optimizeScript.remove();
    }

    // Clean up global objects
    if (window.sovPageConfig) {
      delete window.sovPageConfig;
    }
    if (window.sovPageStatus) {
      delete window.sovPageStatus;
    }
    if (window.sovPageInitialized) {
      delete window.sovPageInitialized;
    }
  } catch (error) {
    loggerError("Error during cleanup in unmount:", "LandingPage", error);
  }
}

interface _SovendusPublicPageWindow extends Window {
  sovPageConfig?: SovendusPageConfig;
  sovPageStatus?: SovPageStatus;
  sovPageInitialized?: number;
}

declare let window: _SovendusPublicPageWindow;
