'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { StepperProvider, StepBar } from '@/features/step-bar';
import { wizardSteps } from '@/features/create-wizard/WizardSteps';

export default function WizardPage() {
  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom color="primary">
        Meal Plan Creation Wizard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Step-by-step creation of a personalized meal plan
      </Typography>

      <StepperProvider initialSteps={wizardSteps} initialActiveStep={0}>
        <StepBar />
      </StepperProvider>
    </Box>
  );
}
