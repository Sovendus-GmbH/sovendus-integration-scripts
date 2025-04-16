import type { JSX, ReactNode } from "react";
import React from "react";

import { IntegrationTester } from "./components/SelfTester";

export const metadata = {
  title: "Preview ENV for sovendus plugin settings ui",
  description: "Using Next.js <3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
    <>
      <IntegrationTester />
      {children}
    </>
  );
}
