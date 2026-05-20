import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetDriversQuery, useDeleteDriverMutation, useUpdateDriverMutation } from '../../store/api/driverApi';

/**
 * Hook for handling the driver list table, pagination, and loading state.
 */
export const useDriverTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page')) || 1;
  const rows = parseInt(query.get('rows')) || 10;
  const [first, setFirst] = useState(0);
  const [selectedDrivers, setSelectedDrivers] = useState([]);

  const { data: driversData, isLoading: fetchingDrivers } = useGetDriversQuery({ page, limit: rows });

  const responseData = driversData?.data || driversData || {};
  const driverList = Array.isArray(responseData) ? responseData : responseData.data || responseData.list || [];
  const pagination = responseData?.pagination || driversData?.pagination || {};
  const count = pagination?.totalCount || pagination?.totalItems || 0;

  useEffect(() => {
    setFirst(page * rows - rows);
  }, [page, rows]);

  const onPageChange = (e) => {
    navigate(`/driver-management?page=${e.page + 1}&rows=${e.rows}`);
    setFirst(e.first);
  };

  return {
    driverList,
    pagination,
    count,
    onPageChange,
    first,
    rows,
    loading: fetchingDrivers,
    selectedDrivers,
    setSelectedDrivers,
    navigate
  };
};

/**
 * Hook for handling the driver form logic.
 */
export const useDriverForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const methods = useForm({ mode: 'onChange' });

  const setLoading = () => {};

  return {
    ...methods,
    errors: methods.formState.errors,
    navigate,
    setLoading,
    dispatch
  };
};

/**
 * Hook for handling driver deletion logic and confirmation modal.
 */
export const useDriverDelete = () => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [selectedDriversForDelete, setSelectedDriversForDelete] = useState([]);
  const [deleteDriver, { isLoading: isDeleting }] = useDeleteDriverMutation();

  const confirmDelete = (driverId) => {
    setSelectedDriverId(driverId);
    setDeleteDialogVisible(true);
  };

  const handleDelete = async () => {
    try {
      let ids = [];
      if (selectedDriversForDelete?.length > 0) {
        ids = selectedDriversForDelete;
      } else if (selectedDriverId) {
        ids = [selectedDriverId];
      }

      if (ids.length > 0) {
        await deleteDriver({ ids }).unwrap();
        setSelectedDriversForDelete([]);
        setSelectedDriverId(null);
        setDeleteDialogVisible(false);
      }
    } catch (err) {
      console.error('Failed to delete driver:', err);
    }
  };

  return {
    deleteDialogVisible,
    setDeleteDialogVisible,
    confirmDelete,
    handleDelete,
    selectedDriversForDelete,
    setSelectedDriversForDelete,
    loading: isDeleting
  };
};

/**
 * Hook for handling driver status toggle (status and document verification).
 */
export const useDriverStatus = () => {
  const [updateDriver, { isLoading: isUpdating }] = useUpdateDriverMutation();

  const handleToggleStatus = async (id, newState, isDocument) => {
    let payload;
    if (isDocument) {
      payload = { isDocumentVerified: newState };
    } else {
      payload = { status: newState ? 'active' : 'inactive' };
    }
    try {
      await updateDriver({ id, payload }).unwrap();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  return {
    handleToggleStatus,
    loading: isUpdating
  };
};
