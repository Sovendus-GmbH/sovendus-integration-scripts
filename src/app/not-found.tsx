"use client";

import Link from "next/link";
import type { JSX } from "react";
import { useEffect } from "react";

export default function NotFound(): JSX.Element {
  useEffect(() => {
    // If we're at the root path but still getting a 404, try to redirect to index.html
    if (window.location.pathname === "/" || window.location.pathname === "") {
      window.location.href = "/index.html";
    }
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/" style={{ color: "blue", textDecoration: "underline" }}>
        Go back to the homepage
      </Link>
    </div>
  );
}
