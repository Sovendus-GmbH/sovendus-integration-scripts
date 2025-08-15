import type {
  SovendusPageConfig,
  SovPageStatus,
} from "sovendus-integration-types";

import type { SovendusPage } from "../sovendus-page-handler";

export function processPageConfig(
  this: SovendusPage,
  sovPageConfig: SovendusPageConfig,
  sovPageStatus: SovPageStatus,
): void {
  this.handleCountryCode(sovPageConfig, sovPageStatus);
}
