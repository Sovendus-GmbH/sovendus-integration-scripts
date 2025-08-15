import type { SovendusPageUrlParams } from "sovendus-integration-types";

import type { SovendusThankyouPage } from "../thankyou-page-handler";

// make it async as some platforms might need to wait for the cookies
export function getCookie(
  this: SovendusThankyouPage,
  name: keyof SovendusPageUrlParams,
): Promise<string | undefined> | string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
  return undefined;
}
