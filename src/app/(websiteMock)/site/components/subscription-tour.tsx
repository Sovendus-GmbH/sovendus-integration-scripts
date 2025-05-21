"use client";

import type { JSX } from "react";
import { useEffect, useState } from "react";
import type { CallBackProps, Status, Step } from "react-joyride";
import Joyride, { STATUS } from "react-joyride";

import { useTour } from "./tour-context";

export default function SubscriptionTour(): JSX.Element {
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
    // Only show subscription tour if it's active and not completed
    if (
      currentStep === "subscription" &&
      tourActive &&
      !isStepCompleted("subscription")
    ) {
      setRun(true);
      setSteps([
        {
          target: "body",
          content:
            "This is the Subscriptions page where users can manage their subscriptions.",
          placement: "center",
          disableBeacon: true,
        },
        {
          target: ".sovendus-integration-scripts-rewards-preview",
          content:
            "Notice the Sovendus Rewards banner here! This integration shows vouchers and offers to your customers based on their subscription activity.",
          placement: "bottom",
        },
        {
          target: ".admin-bar-button",
          content:
            "You can always access the admin panel to configure how the Sovendus banners appear.",
          placement: "bottom",
        },
        {
          target: "body",
          content:
            "Try interacting with the Sovendus component to see how it works for your users!",
          placement: "center",
        },
      ]);
    } else {
      setRun(false);
    }
  }, [currentStep, tourActive, isStepCompleted]);

  const handleJoyrideCallback = (data: CallBackProps): void => {
    const { status } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as Status[]).includes(status)) {
      setRun(false);
      endTour();
      setCompletedStep("subscription");
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
