import type {
  SovendusPageUrlParams,
  SovPageStatus,
} from "sovendus-integration-types";

import { loggerError } from "../../shared-utils";
import type { SovendusPage } from "../sovendus-page-handler";

export async function lookForUrlParamsToStore(
  this: SovendusPage,
  sovPageStatus: SovPageStatus,
): Promise<SovendusPageUrlParams> {
  try {
    const pageViewData: SovendusPageUrlParams =
      await this.getSovendusUrlParameters();
    await Promise.all(
      Object.entries(pageViewData).map(async ([cookieKey, cookieValue]) => {
        if (cookieValue) {
          // for simplicity we store all supported url params as cookies
          // as without the url params the cookies would not be set anyway
          // each url param requires separate opt in on Sovendus side, so this is safe to use
          // you can add your custom logic here if you want to limit to certain url params
          await this.setCookie(cookieKey, cookieValue);
          sovPageStatus.status.storedCookies = true;
        }
      }),
    );
    return pageViewData;
  } catch (error) {
    loggerError("Error while storing url params", "LandingPage", error);
  }
  return {
    sovCouponCode: undefined,
    sovReqToken: undefined,
    puid: undefined,
    sovDebugLevel: undefined,
  };
}
