import type { JSX, ReactNode } from "react";

import { TourProvider } from "../(websiteMock)/site/components/tour-context";

export const metadata = {
  title: "Admin Mock",
  description: "Admin Mock",
};

export default function AdminMockLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body>
        <TourProvider>{children}</TourProvider>
      </body>
    </html>
  );
}
