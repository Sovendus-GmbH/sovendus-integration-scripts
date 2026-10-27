"use client";

import type { JSX } from "react";
import { MockDashboard as _MockDashboard } from "sovendus-integration-settings-ui/demo-style-less";

import { clearStorage } from "../../(websiteMock)/site/components/self-tester";

export default function AdminMockDashboardPage(): JSX.Element {
  return <_MockDashboard urlPrefix="/admin" clearStorage={clearStorage} />;
}
