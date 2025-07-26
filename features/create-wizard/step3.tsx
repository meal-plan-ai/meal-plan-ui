import { Typography, Box } from '@mui/material';

const Step3Content = () => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Final Settings
    </Typography>
    <Typography variant="body1" paragraph>
      This is the content of the third step. Final configuration and confirmation of creating a meal
      plan.
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Example: meal times, recipe complexity, budget, etc.
    </Typography>
  </Box>
);

export { Step3Content };
