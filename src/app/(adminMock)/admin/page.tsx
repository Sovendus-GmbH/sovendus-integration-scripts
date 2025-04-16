"use client";

import type { JSX } from "react";
import { MockDashboard as _MockDashboard } from "sovendus-integration-settings-ui/demo-style-less";

export default function AdminMockDashboardPage(): JSX.Element {
  return <_MockDashboard urlPrefix="/admin" />;
}
