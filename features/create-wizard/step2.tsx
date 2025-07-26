import { Box, Typography } from '@mui/material';

const Step2Content = () => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Dietary Preferences
    </Typography>
    <Typography variant="body1" paragraph>
      This is the content of the second step. Here the user can specify their dietary preferences
      and restrictions.
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Example: vegetarianism, allergies, disliked foods, calorie intake, etc.
    </Typography>
  </Box>
);

export { Step2Content };
