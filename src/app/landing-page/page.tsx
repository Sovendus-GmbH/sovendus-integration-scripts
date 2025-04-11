"use client";

import { type JSX, useEffect, useState } from "react";
import { getSettings } from "sovendus-integration-settings-ui/demo-style-less";
import type { SovendusAppSettings } from "sovendus-integration-types";

import { SovendusLandingPageReact } from "../../scripts/react";
import { loggerInfo } from "../../scripts/vanilla";
import SovendusLandingPageDemoForm from "./demo-form";

export default function SovendusLandingPageDemo(): JSX.Element {
  const [settings, setSettings] = useState<SovendusAppSettings>();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    setSettings(getSettings());
  }, []);
  return settings ? (
    <div>
      <h1 style={{ paddingBottom: "40px" }}>This is a example landing page</h1>
      <div>
        <SovendusLandingPageDemoForm />
      </div>
      <SovendusLandingPageReact
        country={undefined} // TODO add country selector in form
        integrationType="sovendus-integration-scripts-preview"
        settings={settings}
        onDone={(sovPageStatus, sovPageConfig) => {
          loggerInfo(
            "Sovendus Page done",
            "LandingPage",
            "sovPageStatus",
            sovPageStatus,
            "sovPageConfig",
            sovPageConfig,
          );
        }}
      />
    </div>
  ) : (
    <></>
  );
}
