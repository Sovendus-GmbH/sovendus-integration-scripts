"use client";

import type { JSX } from "react";
import { SettingsUIDemo as _SettingsUIDemo } from "sovendus-integration-settings-ui/demo-style-less";
import { TriggerPages } from "sovendus-integration-types";

import { clearStorage } from "../../../(websiteMock)/site/components/self-tester";

export default function SettingsUIDemo(): JSX.Element {
  return (
    <_SettingsUIDemo
      clearStorage={clearStorage}
      urlPrefix="/admin"
      featureFlags={{
        employeeBenefits: {
          addToSidebar: false,
          showWidgetOnDashboard: false,
          isEnabled: false,
        },
        rewards: {
          rewardsEnabled: false,
          triggers: {
            [TriggerPages.MY_ACCOUNT_DASHBOARD]: false,
            [TriggerPages.MY_ORDERS]: false,
            [TriggerPages.MY_ORDERS_DETAIL]: false,
            [TriggerPages.CUSTOM]: false,
          },
        },
      }}
    />
  );
}
