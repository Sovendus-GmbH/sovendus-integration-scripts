import type { SovPageStatus } from "sovendus-integration-types";

import { integrationScriptVersion } from "../../constants";
import type { SovendusPage } from "../sovendus-page-handler";

export function initializePageStatus(this: SovendusPage): SovPageStatus {
  return {
    integrationScriptVersion: integrationScriptVersion,
    urlData: {
      sovCouponCode: undefined,
      sovReqToken: undefined,
      puid: undefined,
      sovDebugLevel: undefined,
    },
    status: {
      sovPageConfigFound: false,
      loadedOptimize: false,
      storedCookies: false,
      countryCodePassedOnByPlugin: false,
    },
    times: {
      integrationLoaderStart: this.getPerformanceTime(),
    },
  };
}

