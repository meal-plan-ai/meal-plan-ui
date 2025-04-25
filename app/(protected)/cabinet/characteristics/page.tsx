'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Chip,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useDeleteMealCharacteristic,
  useMealCharacteristics,
} from '@/api/next-client-api/meal-characteristics/meal-characteristics.hooks';
import {
  Goal,
  IMealCharacteristic,
} from '@/api/nest-server-api/meal-characteristics/meal-characteristics.types';
import { toast } from 'react-hot-toast';

const queryClient = new QueryClient();

type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

function CharacteristicsListPageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <CharacteristicsListPageContent />
    </QueryClientProvider>
  );
}

function CharacteristicsListPageContent() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  const { data, isLoading, refetch } = useMealCharacteristics(page + 1, rowsPerPage);
  const deleteMutation = useDeleteMealCharacteristic();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateClick = () => {
    router.push('/cabinet/characteristics/create');
  };

  const handleEditClick = (id: string) => {
    router.push(`/cabinet/characteristics/edit/${id}`);
  };

  const handleViewClick = (id: string) => {
    router.push(`/cabinet/characteristics/view/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setPlanToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (planToDelete) {
      try {
        await deleteMutation.mutateAsync(planToDelete);
        toast.success('Plan deleted successfully');
        refetch();
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
    setDeleteDialogOpen(false);
    setPlanToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPlanToDelete(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getGoalLabel = (goal: string | undefined) => {
    if (!goal) return 'Not Specified';

    switch (goal) {
      case Goal.WEIGHT_LOSS:
        return 'Weight Loss';
      case Goal.MUSCLE_GAIN:
        return 'Muscle Gain';
      case Goal.MAINTENANCE:
        return 'Maintenance';
      default:
        return goal;
    }
  };

  const getGoalColor = (goal: string | undefined): ChipColor => {
    if (!goal) return 'default';

    switch (goal) {
      case Goal.WEIGHT_LOSS:
        return 'success';
      case Goal.MUSCLE_GAIN:
        return 'primary';
      case Goal.MAINTENANCE:
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1">
            My Nutrition Profiles
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            Nutrition profiles define your dietary goals and calorie targets that will be used as
            the foundation for creating complete meal plans.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Create New Profile
        </Button>
      </Box>

      <Paper elevation={2} sx={{ mb: 4 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Profile Name</TableCell>
                    <TableCell>Goal</TableCell>
                    <TableCell>Calories</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!data || data.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No nutrition profiles found. Create your first profile!
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.data.map((plan: IMealCharacteristic) => (
                      <TableRow key={plan.id}>
                        <TableCell component="th" scope="row">
                          {plan.planName}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getGoalLabel(plan.goal)}
                            color={getGoalColor(plan.goal)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{plan.targetDailyCalories || 'Not specified'} kcal</TableCell>
                        <TableCell>{formatDate(plan.createdAt)}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton onClick={() => handleViewClick(plan.id)} color="info">
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Plan">
                            <IconButton onClick={() => handleEditClick(plan.id)} color="primary">
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Plan">
                            <IconButton onClick={() => handleDeleteClick(plan.id)} color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data?.meta?.totalItems || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Nutrition Profile</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this nutrition profile? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            autoFocus
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CharacteristicsListPageWrapper;
