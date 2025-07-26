import { StepConfig } from '../step-bar';
import { Step1Content } from './step1';
import { Step2Content } from './step2';
import { Step3Content } from './step3';
import { Step4Content } from './step4';

const wizardSteps: StepConfig[] = [
  {
    stepNumber: 1,
    title: 'Basic Information',
    component: <Step1Content />,
    onNext: async () => {
      console.log('Moving to step 2 - saving basic information');
      // Here you can add validation and data saving
    },
  },
  {
    stepNumber: 2,
    title: 'Dietary Preferences',
    component: <Step2Content />,
    onNext: async () => {
      console.log('Moving to step 3 - saving dietary preferences');
    },
    onPrev: async () => {
      console.log('Returning to step 1');
    },
  },
  {
    stepNumber: 3,
    title: 'Settings',
    component: <Step3Content />,
    onNext: async () => {
      console.log('Moving to step 4 - saving settings');
    },
    onPrev: async () => {
      console.log('Returning to step 2');
    },
  },
  {
    stepNumber: 4,
    title: 'Confirmation',
    component: <Step4Content />,
    onPrev: async () => {
      console.log('Returning to step 3');
    },
  },
];

export { wizardSteps };
