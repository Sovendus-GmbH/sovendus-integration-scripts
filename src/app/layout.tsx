import "./app.css";
import "sovendus-integration-settings-ui/dist/demo-style-less/sovendus-integration-settings-ui.css";

import type { JSX, ReactNode } from "react";
import React from "react";

export const metadata = {
  title: "Preview ENV for sovendus plugin settings ui",
  description: "Using Next.js <3",
};

export default function RootMockLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body
        style={{
          background: "#ccc",
        }}
      >
        <main>{children}</main>
      </body>
    </html>
  );
}
