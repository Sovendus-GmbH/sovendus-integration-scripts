"use client";

import { useRouter } from "next/navigation";
import type { JSX } from "react";
import { useEffect, useState } from "react";
import type { CallBackProps, Status, Step } from "react-joyride";
import Joyride, { STATUS } from "react-joyride";

import { useTour } from "./tour-context";

export default function HomeTour(): JSX.Element {
  const router = useRouter();
  const {
    tourActive,
    currentStep,
    endTour,
    setCompletedStep,
    isStepCompleted,
    continueToNextStep,
  } = useTour();
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    // Only show home tour if it's active and not completed
    if (currentStep === "home" && tourActive && !isStepCompleted("home")) {
      setRun(true);
      setSteps([
        {
          target: "body",
          content:
            "Welcome to the Sovendus Mock Store! This guided tour will help you understand how Sovendus integrations work in this demo environment.",
          placement: "center",
          disableBeacon: true,
        },
        {
          target: ".admin-bar-button",
          content:
            "Click here to access the admin backend where you can configure Sovendus settings.",
          placement: "bottom",
        },
        {
          target: ".header-navigation",
          content:
            "You can navigate between different sections of the store using these links.",
          placement: "bottom",
        },
        {
          target: ".shop-now-button",
          content:
            'Click "Shop Now" to simulate a purchase and see the Sovendus banner on the thank you page.',
          placement: "bottom",
        },
        {
          target: ".subscriptions-link",
          content:
            "You can also check out the Subscriptions page to see another Sovendus integration example.",
          placement: "bottom",
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
      setCompletedStep("home");
    }

    // If user clicked on admin bar button step
    if (type === "step:after" && index === 1) {
      const adminButton = document.querySelector(
        ".admin-bar-button",
      ) as HTMLElement;
      if (adminButton) {
        setRun(false);
        endTour();
        setCompletedStep("home");

        // Set admin as the next step in the tour
        continueToNextStep("admin");

        // Navigate to admin page
        setTimeout(() => {
          router.push("/admin");
        }, 300);
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
