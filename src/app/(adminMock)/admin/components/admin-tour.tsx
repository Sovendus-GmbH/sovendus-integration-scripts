"use client";

import { useRouter } from "next/navigation";
import type { JSX } from "react";
import { useEffect, useState } from "react";
import type { CallBackProps, Status, Step } from "react-joyride";
import Joyride, { STATUS } from "react-joyride";

import { useTour } from "../../../(websiteMock)/site/components/tour-context";

export default function AdminTour(): JSX.Element {
  const router = useRouter();
  const {
    tourActive,
    currentStep,
    endTour,
    setCompletedStep,
    isStepCompleted,
  } = useTour();
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    // Only show admin tour if it's active and not completed
    if (currentStep === "admin" && tourActive && !isStepCompleted("admin")) {
      setRun(true);
      setSteps([
        {
          target: "body",
          content:
            "Welcome to the Admin Dashboard! This is where you can configure your Sovendus integration settings.",
          placement: "center",
          disableBeacon: true,
        },
        {
          target: ".admin-navigation",
          content:
            "Use this navigation menu to access different admin sections.",
          placement: "right",
        },
        {
          target: ".sovendus-settings-link",
          content: "Click here to access Sovendus integration settings.",
          placement: "bottom",
        },
        {
          target: ".sovendus-config-section",
          content:
            "This section allows you to configure Sovendus integration parameters.",
          placement: "bottom",
        },
        {
          target: ".preview-button",
          content:
            "After configuring settings, you can preview your store with Sovendus integrations.",
          placement: "bottom",
        },
        {
          target: "body",
          content:
            "Let's head back to the storefront to see Sovendus in action!",
          placement: "center",
        },
      ]);
    } else {
      setRun(false);
    }
  }, [currentStep, tourActive, isStepCompleted]);

  const handleJoyrideCallback = (data: CallBackProps): void => {
    const { status, index, type } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as Status[]).includes(status)) {
      setRun(false);
      endTour();
      setCompletedStep("admin");

      // Navigate back to the site after tour completion
      setTimeout(() => {
        router.push("/site");
      }, 500);
    }

    // If user clicked on settings link step
    if (type === "step:after" && index === 2) {
      const settingsLink = document.querySelector(
        ".sovendus-settings-link",
      ) as HTMLElement;
      if (settingsLink) {
        settingsLink.click();
      }
    }
  };

  return (
    <>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        run={run}
        scrollToFirstStep
        showProgress
        showSkipButton
        steps={steps}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: "#4F46E5",
          },
        }}
      />
    </>
  );
}
