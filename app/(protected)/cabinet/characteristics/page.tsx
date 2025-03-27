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
import { getCharacteristics, deleteCharacteristic } from './actions';
import { NutritionCharacteristics } from '@/lib/generateCharacteristics';
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
async function deleteCharacteristicAction(prevState: DeleteValidationResult, formData: FormData) {
  const planId = formData.get('planId') as string;

  if (!planId) {
    return {
      success: false,
      data: null,
      formState: {
        message: 'Invalid nutrition plan ID',
        fieldErrors: {},
      },
    };
  }

  try {
    const result = await deleteCharacteristic(planId);
    if (result.success) {
      return {
        success: true,
        data: planId,
        formState: {
          message: 'Nutrition plan deleted successfully',
        },
      };
    } else {
      return {
        success: false,
        data: null,
        formState: {
          message: result.error || 'Failed to delete nutrition plan',
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

export default function CharacteristicsListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<NutritionCharacteristics[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [validationResult, deleteAction, pending] = useFormState(
    deleteCharacteristicAction,
    initialState
  );
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCharacteristics(page + 1, rowsPerPage);
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

  return (
    <Box>
      {showSuccessAlert && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setShowSuccessAlert(false)}>
          Nutrition plan deleted successfully
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
        {loading ? (
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
                  {plans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No nutrition plans found. Create your first plan!
                      </TableCell>
                    </TableRow>
                  ) : (
                    plans.map(plan => (
                      <TableRow key={plan.id}>
                        <TableCell component="th" scope="row">
                          {plan.name}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              plan.goal === 'lose'
                                ? 'Weight Loss'
                                : plan.goal === 'gain'
                                  ? 'Weight Gain'
                                  : 'Maintenance'
                            }
                            color={
                              plan.goal === 'lose'
                                ? 'success'
                                : plan.goal === 'gain'
                                  ? 'primary'
                                  : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{plan.caloriesTarget} kcal</TableCell>
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
          <DialogTitle>Delete Nutrition Plan</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this nutrition plan? This action cannot be undone.
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
