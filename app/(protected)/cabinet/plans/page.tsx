'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFormState } from 'react-dom';
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
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { getMealPlans, deleteMealPlan } from './actions';
import { MealPlan } from '@/lib/generateMealPlans';
import { EMPTY_FORM_STATE } from '@/utils/form-state';

// Define types for form validation
interface DeleteValidationResult {
  success: boolean;
  data: string | null;
  formState: {
    message?: string;
    fieldErrors?: Record<string, string[] | undefined>;
  };
}

// Server action for deletion with validation
async function deleteMealPlanAction(prevState: DeleteValidationResult, formData: FormData) {
  const planId = formData.get('planId') as string;

  if (!planId) {
    return {
      success: false,
      data: null,
      formState: {
        message: 'Invalid plan ID',
        fieldErrors: {},
      },
    };
  }

  try {
    const result = await deleteMealPlan(planId);
    if (result.success) {
      return {
        success: true,
        data: planId,
        formState: {
          message: 'Plan deleted successfully',
        },
      };
    } else {
      return {
        success: false,
        data: null,
        formState: {
          message: result.error || 'Failed to delete plan',
        },
      };
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      formState: {
        message: error instanceof Error ? error.message : 'An error occurred',
      },
    };
  }
}

const initialState: DeleteValidationResult = {
  success: false,
  data: null,
  formState: EMPTY_FORM_STATE,
};

export default function MealPlansListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [validationResult, deleteAction, pending] = useFormState(
    deleteMealPlanAction,
    initialState
  );
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMealPlans(page + 1, rowsPerPage);
      setPlans(response.data);
      setTotalCount(response.pagination.total);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Handle successful deletion
  useEffect(() => {
    if (validationResult.success && validationResult.data) {
      setDeleteDialogOpen(false);
      setShowSuccessAlert(true);
      // Refresh the plans list
      fetchPlans();

      // Hide success message after 3 seconds
      const timeoutId = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [validationResult, fetchPlans]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateClick = () => {
    router.push('/cabinet/plans/create');
  };

  const handleViewClick = (id: string) => {
    router.push(`/cabinet/plans/view/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/cabinet/plans/edit/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setPlanToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPlanToDelete(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Box>
      {showSuccessAlert && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setShowSuccessAlert(false)}>
          Meal plan deleted successfully
        </Alert>
      )}

      {validationResult.formState.message && !validationResult.success && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => (validationResult.formState.message = '')}
        >
          {validationResult.formState.message}
        </Alert>
      )}

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4" component="h1">
          Meal Plans
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
                    <TableCell>Name</TableCell>
                    <TableCell>Diet Type</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Calories</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No meal plans found. Create your first plan!
                      </TableCell>
                    </TableRow>
                  ) : (
                    plans.map(plan => (
                      <TableRow key={plan.id} hover>
                        <TableCell>{plan.name}</TableCell>
                        <TableCell>{plan.dietType}</TableCell>
                        <TableCell>{plan.duration} days</TableCell>
                        <TableCell>{plan.targetCalories} kcal</TableCell>
                        <TableCell>
                          <Chip
                            label={plan.isActive ? 'Active' : 'Inactive'}
                            color={plan.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
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

      {/* Delete Confirmation Dialog with Server-side Validation */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <form action={deleteAction}>
          <DialogTitle>Delete Meal Plan</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this meal plan? This action cannot be undone.
            </DialogContentText>
            {planToDelete && <input type="hidden" name="planId" value={planToDelete} />}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary" disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" color="error" autoFocus disabled={pending}>
              {pending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
