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
import {
  useMealCharacteristics,
  useDeleteMealCharacteristic,
} from '@/api/query/meal-characteristics/meal-characteristics.query';
import {
  MealCharacteristicResponseDto,
  Goal,
} from '@/api/query/meal-characteristics/meal-characteristics.dto';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

// Define type for Chip color to fix linter error
type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

// Wrapper component to provide QueryClient
function CharacteristicsListPageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <CharacteristicsListPageContent />
    </QueryClientProvider>
  );
}

// Main component content
function CharacteristicsListPageContent() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  // Use react-query hook for fetching meal characteristics
  const { data, isLoading, refetch } = useMealCharacteristics(page + 1, rowsPerPage);
  console.log(data);
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
        // Use the react-query mutation
        await deleteMutation.mutateAsync(planToDelete);
        // Refresh the data after successful deletion
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
        <Typography variant="h4" component="h1">
          My Nutrition Plans
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Create New Plan
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
                    <TableCell>Plan Name</TableCell>
                    <TableCell>Goal</TableCell>
                    <TableCell>Calories</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!data || data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No nutrition plans found. Create your first plan!
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((plan: MealCharacteristicResponseDto) => (
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
        <DialogTitle>Delete Nutrition Plan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this nutrition plan? This action cannot be undone.
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
