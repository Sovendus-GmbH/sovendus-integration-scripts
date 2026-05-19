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
          addToSidebar: true,
          showWidgetOnDashboard: true,
          isEnabled: true,
        },
        rewards: {
          rewardsEnabled: true,
          triggers: {
            [TriggerPages.MY_ACCOUNT_DASHBOARD]: true,
            [TriggerPages.MY_ORDERS]: true,
            [TriggerPages.MY_ORDERS_DETAIL]: true,
            [TriggerPages.CUSTOM]: true,
          },
        },
      }}
    />
  );
}
