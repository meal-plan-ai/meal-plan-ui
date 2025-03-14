import Link from 'next/link';
import { Button, Box, Typography, Container } from '@mui/material';

export default function NotFound() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          py: 6,
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{ fontWeight: 700, fontSize: { xs: '6rem', md: '8rem' }, mb: 2 }}
        >
          404
        </Typography>

        <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
          Page Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '600px' }}>
          Sorry, the page you are looking for doesn't exist or has been moved. Please check the URL
          or return to the homepage.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" component={Link} href="/" size="large">
            Go to Homepage
          </Button>

          <Button variant="outlined" component={Link} href="/cabinet" size="large">
            Go to Dashboard
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
