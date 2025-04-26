'use client';

import { IMealPlan } from '@/api/nest-server-api';
import { Box, Button, CardContent, Divider, Grid, Typography } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import moment from 'moment';

import { Card } from '@mui/material';

const PlanDetails = ({ mealPlan }: { mealPlan: IMealPlan }) => {
  const router = useRouter();

  const handleEditPlan = () => {
    router.push(`/plans/edit/${mealPlan.id}`);
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Plan Details
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleEditPlan}
          >
            Edit Plan
          </Button>
        </Box>

        <Divider sx={{ m: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Name
            </Typography>
            <Typography variant="body1">{mealPlan.name}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Duration
            </Typography>
            <Typography variant="body1">{mealPlan.durationInDays} days</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Created
            </Typography>
            <Typography variant="body1">
              {moment(mealPlan.createdAt).format('DD/MM/YYYY')}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Last Modified
            </Typography>
            <Typography variant="body1">
              {moment(mealPlan.updatedAt).format('DD/MM/YYYY')}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PlanDetails;
