"use client";

import type { JSX, ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type TourStep = "home" | "admin" | "subscription" | "thankyou";

interface TourContextType {
  tourActive: boolean;
  currentStep: TourStep;
  runTour: (step: TourStep) => void;
  endTour: () => void;
  completedSteps: TourStep[];
  setCompletedStep: (step: TourStep) => void;
  isStepCompleted: (step: TourStep) => boolean;
  continueToNextStep: (nextStep: TourStep) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

const STORAGE_KEY_COMPLETED = "sovendus-tour-completed";
const STORAGE_KEY_NEXT_STEP = "sovendus-tour-next-step";

export function TourProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [tourActive, setTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<TourStep>("home");
  const [completedSteps, setCompletedSteps] = useState<TourStep[]>([]);
  const [pendingNextStep, setPendingNextStep] = useState<TourStep | null>(null);

  const runTour = useCallback((step: TourStep) => {
    setCurrentStep(step);
    setTourActive(true);
  }, []);

  const endTour = useCallback(() => {
    setTourActive(false);
  }, []);

  const setCompletedStep = useCallback((step: TourStep) => {
    setCompletedSteps((prev) => {
      if (!prev.includes(step)) {
        return [...prev, step];
      }
      return prev;
    });
  }, []);

  const isStepCompleted = useCallback(
    (step: TourStep) => {
      return completedSteps.includes(step);
    },
    [completedSteps],
  );

  // Store the next step in localStorage and navigate to it
  const continueToNextStep = useCallback((nextStep: TourStep) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_NEXT_STEP, nextStep);
    }
  }, []);

  // Check localStorage on mount to see if tour is completed
  useEffect(() => {
    if (typeof window !== "undefined") {
      const completedTourSteps = localStorage.getItem(STORAGE_KEY_COMPLETED);
      if (completedTourSteps) {
        setCompletedSteps(JSON.parse(completedTourSteps) as TourStep[]);
      }

      // Check for pending next step
      const nextStep = localStorage.getItem(STORAGE_KEY_NEXT_STEP);
      if (nextStep) {
        setPendingNextStep(nextStep as TourStep);
        localStorage.removeItem(STORAGE_KEY_NEXT_STEP);
      }
    }
  }, []);

  // Execute pending step if any
  useEffect(() => {
    if (pendingNextStep) {
      runTour(pendingNextStep);
      setPendingNextStep(null);
    }
  }, [pendingNextStep, runTour]);

  // Save completed steps to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && completedSteps.length > 0) {
      localStorage.setItem(
        STORAGE_KEY_COMPLETED,
        JSON.stringify(completedSteps),
      );
    }
  }, [completedSteps]);

  return (
    <TourContext.Provider
      value={{
        tourActive,
        currentStep,
        runTour,
        endTour,
        completedSteps,
        setCompletedStep,
        isStepCompleted,
        continueToNextStep,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour(): TourContextType {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}
