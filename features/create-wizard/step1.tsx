import { Box, Typography } from '@mui/material';

const Step1Content = () => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Basic Information
    </Typography>
    <Typography variant="body1" paragraph>
      This is the content of the first step. Here you can place a form to enter basic information
      about the meal plan.
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Example: plan name, duration, general preferences, etc.
    </Typography>
  </Box>
);

export { Step1Content };
