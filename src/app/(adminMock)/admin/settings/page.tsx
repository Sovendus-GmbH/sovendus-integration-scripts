"use client";

import type { JSX } from "react";
import { SettingsUIDemo } from "sovendus-integration-settings-ui/demo-style-less";
import { TriggerPages } from "sovendus-integration-types";

export default function _SettingsUIDemo(): JSX.Element {
  return (
    <SettingsUIDemo
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
