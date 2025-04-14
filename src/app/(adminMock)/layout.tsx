import type { JSX, ReactNode } from "react";

export const metadata = {
  title: "Admin Mock",
  description: "Admin Mock",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
