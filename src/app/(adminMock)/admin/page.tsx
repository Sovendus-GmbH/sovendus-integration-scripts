"use client";

import type { JSX } from "react";
import { useEffect } from "react";

import { clearStorage } from "../../(websiteMock)/site/components/self-tester";
import { useTour } from "../../(websiteMock)/site/components/tour-context";
import AdminTour from "./components/admin-tour";
import TourEnabledDashboard from "./components/tour-enabled-dashboard";

export default function AdminMockDashboardPage(): JSX.Element {
  const { runTour, isStepCompleted } = useTour();

  // Start the admin tour automatically if not completed
  useEffect(() => {
    if (!isStepCompleted("admin")) {
      runTour("admin");
    }
  }, [isStepCompleted, runTour]);

  return (
    <>
      <AdminTour />
      <TourEnabledDashboard urlPrefix="/admin" clearStorage={clearStorage} />
    </>
  );
}
