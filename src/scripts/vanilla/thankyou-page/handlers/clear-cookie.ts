import type { SovendusPageUrlParams } from "sovendus-integration-types";

import type { SovendusThankyouPage } from "../thankyou-page-handler";

export function clearCookie(
  this: SovendusThankyouPage,
  name: keyof SovendusPageUrlParams,
): void {
  // only capable clearing a cookie
  const path = "/";
  const domain = window.location.hostname;
  const cookieString = `${name}=;secure;samesite=strict;expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=${domain};path=${path}`;
  document.cookie = cookieString;
}
