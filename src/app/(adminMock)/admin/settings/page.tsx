"use client";

import type { JSX } from "react";
import { SettingsUIDemo as _SettingsUIDemo } from "sovendus-integration-settings-ui/demo-style-less";
import { TriggerPages } from "sovendus-integration-types";

export default function SettingsUIDemo(): JSX.Element {
  return (
    <_SettingsUIDemo
      urlPrefix="/admin"
      featureFlags={{
        employeeBenefits: {
          addToSidebar: true,
          showWidgetOnDashboard: true,
          isEnabled: false,
        },
        rewards: {
          rewardsEnabled: false,
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
