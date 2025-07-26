import { ReactNode } from 'react';

export interface StepConfig {
  stepNumber: number;
  title: string;
  component: ReactNode;
  onNext?: () => void | Promise<void>;
  onPrev?: () => void | Promise<void>;
}

export interface StepperContextType {
  activeStep: number;
  steps: StepConfig[];
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  goToNext: () => void;
  goToPrev: () => void;
  goToStep: (stepNumber: number) => void;
  setSteps: (steps: StepConfig[]) => void;
}

export interface StepperProviderProps {
  children: ReactNode;
  initialSteps?: StepConfig[];
  initialActiveStep?: number;
}
