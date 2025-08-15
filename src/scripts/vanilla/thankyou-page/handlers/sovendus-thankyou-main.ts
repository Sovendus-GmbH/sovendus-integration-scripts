import type { SovendusThankyouPageData } from "sovendus-integration-types";
import type { SovendusThankYouPageConfig } from "sovendus-integration-types";

import { loggerError } from "../../shared-utils";
import type { SovendusThankyouPage } from "../thankyou-page-handler";

export async function sovendusThankyouMain(
  this: SovendusThankyouPage,
  sovThankyouConfig: SovendusThankYouPageConfig,
  onDone: ({
    sovThankyouConfig,
    sovThankyouStatus,
  }: SovendusThankyouPageData) => void,
): Promise<void> {
  const sovThankyouStatus = this.initializeStatus();
  try {
    if (!sovThankyouConfig) {
      sovThankyouStatus.status.sovThankyouConfigFound = false;
      loggerError("sovThankyouConfig is not defined", "ThankyouPage");
      onDone({ sovThankyouStatus, sovThankyouConfig });
      return;
    }
    sovThankyouStatus.status.sovThankyouConfigFound = true;
    await this.processConfig(sovThankyouConfig, sovThankyouStatus);

    await Promise.all([
      this.handleVoucherNetwork(sovThankyouConfig, sovThankyouStatus),
      this.handleOptimizeConversion(sovThankyouConfig, sovThankyouStatus),
      this.handleCheckoutProductsConversion(
        sovThankyouConfig,
        sovThankyouStatus,
      ),
    ]);
    sovThankyouStatus.times.integrationLoaderDone = this.getPerformanceTime();
    sovThankyouStatus.status.integrationLoaderDone = true;
  } catch (error) {
    loggerError("Error in SovendusThankyouPage.main", "ThankyouPage", error);
  }
  onDone({ sovThankyouConfig, sovThankyouStatus });
}
