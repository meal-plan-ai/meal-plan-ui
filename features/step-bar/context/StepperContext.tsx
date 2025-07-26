'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { StepperContextType, StepperProviderProps, StepConfig } from '../types/stepper.types';

const StepperContext = createContext<StepperContextType | undefined>(undefined);

export function StepperProvider({
  children,
  initialSteps = [],
  initialActiveStep = 0,
}: StepperProviderProps) {
  const [activeStep, setActiveStep] = useState(initialActiveStep);
  const [steps, setSteps] = useState<StepConfig[]>(initialSteps);

  const totalSteps = steps.length;
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === totalSteps - 1;

  const goToNext = useCallback(async () => {
    if (!isLastStep) {
      const currentStep = steps[activeStep];

      // Call onNext handler if it exists
      if (currentStep?.onNext) {
        await currentStep.onNext();
      }

      setActiveStep(prev => prev + 1);
    }
  }, [activeStep, isLastStep, steps]);

  const goToPrev = useCallback(async () => {
    if (!isFirstStep) {
      const currentStep = steps[activeStep];

      // Call onPrev handler if it exists
      if (currentStep?.onPrev) {
        await currentStep.onPrev();
      }

      setActiveStep(prev => prev - 1);
    }
  }, [activeStep, isFirstStep, steps]);

  const goToStep = useCallback(
    (stepNumber: number) => {
      if (stepNumber >= 0 && stepNumber < totalSteps) {
        setActiveStep(stepNumber);
      }
    },
    [totalSteps]
  );

  const contextValue: StepperContextType = {
    activeStep,
    steps,
    totalSteps,
    isFirstStep,
    isLastStep,
    goToNext,
    goToPrev,
    goToStep,
    setSteps,
  };

  return <StepperContext.Provider value={contextValue}>{children}</StepperContext.Provider>;
}

export function useStepper() {
  const context = useContext(StepperContext);
  if (context === undefined) {
    throw new Error('useStepper must be used within a StepperProvider');
  }
  return context;
}

export { StepperContext };
