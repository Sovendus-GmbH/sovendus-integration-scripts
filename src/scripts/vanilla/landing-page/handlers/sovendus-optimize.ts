import type {
  SovendusPageConfig,
  SovPageStatus,
} from "sovendus-integration-types";

import { getOptimizeId } from "../../shared-utils";
import type { SovendusPage } from "../sovendus-page-handler";

export function sovendusOptimize(
  this: SovendusPage,
  sovPageConfig: SovendusPageConfig,
  sovPageStatus: SovPageStatus,
): void {
  const optimizeId = getOptimizeId(
    sovPageConfig.settings,
    sovPageConfig.country,
  );
  if (!optimizeId) {
    return;
  }
  this.handleOptimizeScript(optimizeId, sovPageConfig, sovPageStatus);
  sovPageStatus.status.loadedOptimize = true;
}
