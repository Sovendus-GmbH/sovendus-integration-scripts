"use client";

import type { JSX } from "react";
import { useEffect, useState } from "react";
import type { CallBackProps, Status, Step } from "react-joyride";
import Joyride, { STATUS } from "react-joyride";

import { useTour } from "./tour-context";

export default function ThankYouTour(): JSX.Element {
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
    // Only show thankyou tour if it's active and not completed
    if (
      currentStep === "thankyou" &&
      tourActive &&
      !isStepCompleted("thankyou")
    ) {
      setRun(true);
      setSteps([
        {
          target: "body",
          content:
            "This is the Thank You page that customers see after completing a purchase.",
          placement: "center",
          disableBeacon: true,
        },
        {
          target: ".sovendus-thankyou-page",
          content:
            "Here is the Sovendus Voucher Network integration! It shows personalized vouchers to customers after their purchase, increasing their satisfaction and your revenue.",
          placement: "bottom",
        },
        {
          target: ".sovendus-order-details",
          content:
            "The vouchers are personalized based on the customer's order details and location.",
          placement: "top",
        },
        {
          target: ".admin-bar-button",
          content:
            "You can configure the appearance and behavior of this integration from the admin panel.",
          placement: "bottom",
        },
        {
          target: "body",
          content:
            "That completes our tour! Feel free to explore the different pages and see how Sovendus integrations can enhance your e-commerce site.",
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
      setCompletedStep("thankyou");
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
