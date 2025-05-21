"use client";

import type { JSX } from "react";
import { useEffect, useRef } from "react";
import { MockDashboard } from "sovendus-integration-settings-ui/demo-style-less";

interface TourEnabledDashboardProps {
  urlPrefix: string;
  clearStorage: () => void;
}

/**
 * A wrapper around the MockDashboard component that adds CSS classes for the tour
 */
export default function TourEnabledDashboard({
  urlPrefix,
  clearStorage,
}: TourEnabledDashboardProps): JSX.Element {
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Add CSS classes to the Dashboard elements after it's rendered
  useEffect(() => {
    if (dashboardRef.current) {
      const addTourClasses = (): void => {
        // Add class to navigation menu
        const navMenu = document.querySelector("nav ul");
        if (navMenu) {
          navMenu.classList.add("admin-navigation");
        }

        // Add class to Sovendus settings link
        const settingsLinks = document.querySelectorAll("a");
        settingsLinks.forEach((link) => {
          if (
            link.textContent?.includes("Sovendus") ||
            link.textContent?.includes("Integration") ||
            link.textContent?.includes("Settings")
          ) {
            link.classList.add("sovendus-settings-link");
          }
        });

        // Add class to config sections
        const configSections = document.querySelectorAll(
          "form fieldset, form .form-section",
        );
        configSections.forEach((section) => {
          section.classList.add("sovendus-config-section");
        });

        // Add class to preview buttons
        const buttons = document.querySelectorAll("button");
        buttons.forEach((button) => {
          if (
            button.textContent?.includes("Preview") ||
            button.textContent?.includes("View") ||
            button.textContent?.includes("Store")
          ) {
            button.classList.add("preview-button");
          }
        });
      };

      // Initial setup
      setTimeout(addTourClasses, 500);

      // Re-apply when content changes
      const observer = new MutationObserver(addTourClasses);
      observer.observe(dashboardRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });

      return (): void => observer.disconnect();
    }
    return undefined;
  }, []);

  return (
    <div ref={dashboardRef}>
      <MockDashboard urlPrefix={urlPrefix} clearStorage={clearStorage} />
    </div>
  );
}
