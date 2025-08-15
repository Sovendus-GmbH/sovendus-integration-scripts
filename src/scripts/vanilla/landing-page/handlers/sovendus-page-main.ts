import type {
  SovendusPageConfig,
  SovendusPageData,
} from "sovendus-integration-types";

import { loggerError } from "../../shared-utils";
import type { SovendusPage } from "../sovendus-page-handler";

export async function sovendusPageMain(
  this: SovendusPage,
  sovPageConfig: SovendusPageConfig,
  onDone: ({ sovPageConfig, sovPageStatus }: SovendusPageData) => void,
): Promise<void> {
  const sovPageStatus = this.initializeStatus();
  this.processConfig(sovPageConfig, sovPageStatus);

  try {
    if (!sovPageConfig) {
      sovPageStatus.status.sovPageConfigFound = false;
      onDone({ sovPageStatus, sovPageConfig });
      loggerError("sovPageConfig is not defined", "LandingPage");
      return;
    }
    sovPageStatus.urlData = await this.lookForUrlParamsToStore(sovPageStatus);
    this.sovendusOptimize(sovPageConfig, sovPageStatus);
    sovPageStatus.times.integrationLoaderDone = this.getPerformanceTime();
  } catch (error) {
    loggerError("Crash in SovendusPage.main", "LandingPage", error);
  }
  onDone({ sovPageStatus, sovPageConfig });
}
