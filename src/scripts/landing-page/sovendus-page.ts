import type {
  SovendusPageData,
  SovendusPageWindow,
} from "sovendus-integration-types";

import { SovendusPage } from "./sovendus-page-handler";

declare const window: SovendusPageWindow;

const onDone = ({ sovPageStatus }: SovendusPageData): void => {
  // just used for debugging with the testing app
  window.sovPageStatus = sovPageStatus;
};

void new SovendusPage().main(window.sovPageConfig, onDone);
