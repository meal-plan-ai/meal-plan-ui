import { StepConfig } from '../step-bar';
import { Step1Content } from './step1';
import { Step2Content } from './step2';
import { Step3Content } from './step3';

const wizardSteps: StepConfig[] = [
  {
    stepNumber: 1,
    title: 'Nutrition Profile',
    component: <Step1Content />,
    onNext: async () => {
      console.log('Moving to step 2 - saving basic information');
    },
  },
  {
    stepNumber: 2,
    title: 'Meal Plan',
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
    title: 'Review & Confirm',
    component: <Step3Content />,
    onNext: async () => {
      console.log('Moving to step 4 - saving settings');
    },
    onPrev: async () => {
      console.log('Returning to step 2');
    },
  },
];

export { wizardSteps };
