import type {
  SovendusThankyouPageData,
  SovendusThankyouWindow,
} from "sovendus-integration-types";

import { SovendusThankyouPage } from "./thankyou-page-handler";

declare const window: SovendusThankyouWindow;

const OnDone = ({ sovThankyouStatus }: SovendusThankyouPageData): void => {
  // just used for debugging with the testing app
  window.sovThankyouStatus = sovThankyouStatus;
};

void new SovendusThankyouPage().main(window.sovThankyouConfig, OnDone);
