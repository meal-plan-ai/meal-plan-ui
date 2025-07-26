'use client';

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  styled,
} from '@mui/material';
import { NavigateNext as NextIcon, NavigateBefore as PrevIcon } from '@mui/icons-material';
import { useStepper } from '../context/StepperContext';

// Custom connector for lines between steps
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  '&.Mui-active': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.primary.main,
    },
  },
  '&.Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiStepConnector-line': {
    borderColor: theme.palette.grey[300],
    borderTopWidth: 2,
  },
}));

// Custom icon for steps
const CustomStepIcon = styled('div')<{
  ownerState: { completed: boolean; active: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: ownerState.active
    ? theme.palette.primary.main
    : ownerState.completed
      ? theme.palette.primary.main
      : theme.palette.grey[300],
  color:
    ownerState.active || ownerState.completed
      ? theme.palette.primary.contrastText
      : theme.palette.text.secondary,
  width: 40,
  height: 40,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '14px',
  fontWeight: 'bold',
}));

function StepIcon(props: any) {
  const { active, completed, className, icon } = props;

  return (
    <CustomStepIcon ownerState={{ completed, active }} className={className}>
      {icon}
    </CustomStepIcon>
  );
}

function StepBar() {
  const { activeStep, steps, isFirstStep, isLastStep, goToNext, goToPrev } = useStepper();

  const currentStep = steps[activeStep];

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} connector={<CustomStepConnector />} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.stepNumber}>
              <StepLabel
                StepIconComponent={StepIcon}
                sx={{
                  '& .MuiStepLabel-label': {
                    fontWeight: index === activeStep ? 'bold' : 'normal',
                    color:
                      index === activeStep
                        ? 'primary.main'
                        : index < activeStep
                          ? 'primary.main'
                          : 'text.secondary',
                  },
                }}
              >
                {step.title}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Block 2: Content */}
      <Paper elevation={1} sx={{ p: 4, mb: 3, minHeight: 400 }}>
        <Box>
          <Box sx={{ mt: 3 }}>
            {currentStep?.component || (
              <Typography color="text.secondary">Content not found for the current step</Typography>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Block 3: Navigation */}
      <Paper elevation={1} sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Back button */}
          <Button
            variant="outlined"
            startIcon={<PrevIcon />}
            onClick={goToPrev}
            disabled={isFirstStep}
            sx={{ visibility: isFirstStep ? 'hidden' : 'visible' }}
          >
            Back
          </Button>

          {/* Next button */}
          <Button
            variant="contained"
            endIcon={<NextIcon />}
            onClick={goToNext}
            disabled={isLastStep}
            sx={{ visibility: isLastStep ? 'hidden' : 'visible' }}
          >
            {isLastStep ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export { StepBar };
