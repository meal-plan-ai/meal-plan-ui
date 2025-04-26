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
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useDeleteMealPlan, useMealPlans } from '@/api/next-client-api/meal-plan/meal-plan.hooks';
import toast from 'react-hot-toast';

export default function MealPlansListPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: plansData, isLoading: loading, refetch } = useMealPlans(page + 1, rowsPerPage);
  const deleteMutation = useDeleteMealPlan();

  const plans = plansData?.data || [];
  const totalCount = plans.length;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateClick = () => {
    router.push('/plans/create');
  };

  const handleViewClick = (id: string) => {
    router.push(`/plans/view/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/plans/edit/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setPlanToDelete(id);
    setDeleteDialogOpen(true);
    setDeleteError(null);
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
    setDeleteError(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1">
            Meal Plans
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1, maxWidth: '70%' }}>
            These are your personalized meal plans with daily recipes based on your nutrition
            profiles. Each plan includes specific meals and recipes for the entire duration.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Create New Meal Plan
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Plan Name</TableCell>
                    <TableCell>Duration (days)</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No meal plans found. Create your first complete meal plan based on a
                        nutrition profile!
                      </TableCell>
                    </TableRow>
                  ) : (
                    plans.map(plan => (
                      <TableRow key={plan.id} hover>
                        <TableCell>{plan.name}</TableCell>
                        <TableCell>{plan.durationInDays}</TableCell>
                        <TableCell>{formatDate(plan.createdAt)}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Plan">
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
              count={totalCount}
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
        <DialogTitle>Delete Meal Plan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this meal plan? This action cannot be undone.
          </DialogContentText>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
