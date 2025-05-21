import type { JSX, ReactNode } from "react";
import React from "react";

import { IntegrationTester } from "./components/self-tester";
import { TourProvider } from "./components/tour-context";

export const metadata = {
  title: "Preview ENV for sovendus plugin settings ui",
  description: "Using Next.js <3",
};

export default function WebsiteMockLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
    <>
      <IntegrationTester />
      <TourProvider>{children}</TourProvider>
    </>
  );
}
