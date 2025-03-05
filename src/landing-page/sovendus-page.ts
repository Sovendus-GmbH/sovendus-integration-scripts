import type {
  SovendusPageData,
  SovendusPageWindow,
} from "sovendus-integration-types";

import { SovendusPage } from "./sovendus-page-handler";

declare const window: SovendusPageWindow;

const OnDone = ({ sovPageStatus }: SovendusPageData): void => {
  // just used for debugging with the testing app
  if (sovPageStatus) {
    window.sovPageStatus = sovPageStatus;
  }
};

void new SovendusPage().main(window.sovPageConfig, OnDone);
